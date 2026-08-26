/**
 * WebAssembly bindings for 2D Graphics Engine - Phase 2
 * Exposes full C++ graphics API to JavaScript via Emscripten
 */

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "include/GCanvas.h"
#include "include/GBitmap.h"
#include "include/GColor.h"
#include "include/GRect.h"
#include "include/GPoint.h"
#include "include/GPath.h"
#include "include/GPaint.h"
#include "include/GMatrix.h"
#include "include/GShader.h"
#include "include/GBlendMode.h"
#include "include/GFinal.h"
#include <memory>
#include <vector>
#include <map>
#include <string>

// Forward declare shader factory functions from shader_ops.h
std::unique_ptr<GShader> GCreateRadialGradientShader(const GPoint& center, float radius, const GColor colors[], int count, GTileMode tileMode);
std::unique_ptr<GShader> GCreateAngleGradientShader(GPoint p0, GPoint p1, const GColor colors[], int count);
std::unique_ptr<GShader> GCreateBilerpBitmapShader(const GBitmap& bm, const GMatrix& mat, GTileMode tileMode);
std::unique_ptr<GShader> GCreateTriColorShader(const GPoint points[], const GColor colors[], int count);
std::unique_ptr<GShader> GCreateProxyShader(GShader* shader, GMatrix mat);
std::unique_ptr<GShader> GCreateComposeShader(GShader* shader1, GShader* shader2);
std::unique_ptr<GShader> GCreateNonlinearGradientShader(GPoint p0, GPoint p1, const GColor colors[], const float intervals[], int count, GTileMode tileMode);

using namespace emscripten;

/**
 * Decoded-texture cache.
 *
 * GBitmap::readFromFile allocates the pixel buffer and, per its own header comment,
 * "the caller must call free(bitmap->fPixels) when they are finished." The original
 * createBitmapShaderFromFile never did, so every call leaked one fully decoded image
 * - 552KB for the demo texture. That was survivable when a shader was built once per
 * slider release; it is not survivable when dragging re-renders continuously, where it
 * ran to 33MB over 60 renders.
 *
 * Caching by filename fixes the leak and removes a repeated PNG decode from the
 * render path. Entries live for the lifetime of the module, which is correct: the
 * shaders hold the pixel pointer, so the buffer has to outlive them, and there are
 * only ever a handful of textures.
 */
static GBitmap* cachedBitmap(const std::string& filename) {
    static std::map<std::string, GBitmap> cache;
    auto it = cache.find(filename);
    if (it != cache.end()) {
        return &it->second;
    }
    GBitmap bm;
    if (!bm.readFromFile(filename.c_str())) {
        return nullptr;
    }
    auto inserted = cache.emplace(filename, bm);
    return &inserted.first->second;
}


/**
 * Shared helpers. Colours arrive from JS as a flat [r,g,b,a, r,g,b,a, ...] array and
 * points as [x,y, x,y, ...] - the same convention the original factories used, kept
 * so JS callers do not have to learn two marshalling styles.
 *
 * Matrix argument order is (a, c, e, b, d, f), matching GMatrix's own constructor and
 * the existing createBitmapShaderFromFile - NOT row-major. Getting this wrong silently
 * transposes every transform, so it is spelled out at each call site.
 */
static std::vector<GColor> toColors(const std::vector<float>& flat) {
    size_t count = flat.size() / 4;
    std::vector<GColor> out(count);
    for (size_t i = 0; i < count; ++i) {
        out[i] = GColor::RGBA(flat[i*4], flat[i*4+1], flat[i*4+2], flat[i*4+3]);
    }
    return out;
}

static std::vector<GPoint> toPoints(const std::vector<float>& flat) {
    size_t count = flat.size() / 2;
    std::vector<GPoint> out(count);
    for (size_t i = 0; i < count; ++i) {
        out[i] = GPoint{flat[i*2], flat[i*2+1]};
    }
    return out;
}


/**
 * PathWrapper - JavaScript-friendly wrapper for GPath
 */
class PathWrapper {
public:
    PathWrapper() {}

    void reset() { fPath.reset(); }

    /** Matrix order is (a,c,e,b,d,f) to match GMatrix's constructor. */
    void transform(float m0, float m1, float m2, float m3, float m4, float m5) {
        fPath.transform(GMatrix(m0, m1, m2, m3, m4, m5));
    }

    /* Tight bounds of every segment. Returned as four floats rather than a bound
       GRect value type, keeping the marshalling style consistent with everything
       else here. Empty paths give a degenerate rect, not an error. */
    float boundsLeft()   const { return fPath.bounds().left; }
    float boundsTop()    const { return fPath.bounds().top; }
    float boundsRight()  const { return fPath.bounds().right; }
    float boundsBottom() const { return fPath.bounds().bottom; }
    void moveTo(float x, float y) { fPath.moveTo(x, y); }
    void lineTo(float x, float y) { fPath.lineTo(x, y); }
    void quadTo(float x1, float y1, float x2, float y2) { fPath.quadTo(x1, y1, x2, y2); }
    void cubicTo(float x1, float y1, float x2, float y2, float x3, float y3) {
        fPath.cubicTo(x1, y1, x2, y2, x3, y3);
    }

/*
 * Enum parameters are typed, not int.
 *
 * These three took `int`. embind silently coerces a JS enum object passed to an int
 * parameter to 0, so `paint.setBlendMode(Module.BlendMode.SrcOver)` set Clear, and
 * `path.addCircle(..., Module.PathDirection.CCW)` set CW. Every blend mode collapsed
 * to Clear and winding direction could never be reversed - with no error anywhere.
 *
 * Taking the enum type makes embind marshal the JS enum object correctly. Note it does
 * NOT make the mistake loud: passing a raw integer here now silently selects member
 * zero instead. Pass Module.BlendMode.X / Module.PathDirection.X, never a number.
 */
    void addRect(float x, float y, float width, float height, GPath::Direction direction) {
        GRect rect = GRect::XYWH(x, y, width, height);
        fPath.addRect(rect, static_cast<GPath::Direction>(direction));
    }

    void addCircle(float centerX, float centerY, float radius, GPath::Direction direction) {
        fPath.addCircle({centerX, centerY}, radius, static_cast<GPath::Direction>(direction));
    }

    void addPolygon(const std::vector<float>& points) {
        size_t count = points.size() / 2;
        std::vector<GPoint> gpoints(count);
        for (size_t i = 0; i < count; ++i) {
            gpoints[i] = GPoint{points[i * 2], points[i * 2 + 1]};
        }
        fPath.addPolygon(gpoints.data(), count);
    }

    int countPoints() const { return fPath.countPoints(); }

    const GPath& getPath() const { return fPath; }

private:
    GPath fPath;
};

/**
 * PaintWrapper - JavaScript-friendly wrapper for GPaint
 */
class PaintWrapper {
public:
    PaintWrapper() {}

    void setColor(float r, float g, float b, float a) {
        fPaint.setRGBA(r, g, b, a);
    }

    void setAlpha(float alpha) {
        fPaint.setAlpha(alpha);
    }

    void setBlendMode(GBlendMode mode) {
        fPaint.setBlendMode(mode);
    }

    void setShader(uintptr_t shaderPtr) {
        // Accept raw pointer to shader (managed by ShaderWrapper)
        fPaint.setShader(reinterpret_cast<GShader*>(shaderPtr));
    }

    GPaint getPaint() const { return fPaint; }  // Return by value, not reference

    // Debug: Get color components
    float getColorR() const { return fPaint.getColor().r; }
    float getColorG() const { return fPaint.getColor().g; }
    float getColorB() const { return fPaint.getColor().b; }
    float getColorA() const { return fPaint.getColor().a; }

private:
    GPaint fPaint;
};

/**
 * ShaderWrapper - Manages shader lifetime
 */
class ShaderWrapper {
public:
    ShaderWrapper(std::unique_ptr<GShader> shader) : fShader(std::move(shader)) {}

    uintptr_t getPtr() const {
        return reinterpret_cast<uintptr_t>(fShader.get());
    }

private:
    std::unique_ptr<GShader> fShader;
};

/**
 * CanvasWrapper - Manages a GCanvas instance with its backing bitmap
 */
class CanvasWrapper {
public:
    CanvasWrapper(int width, int height)
        : fWidth(width), fHeight(height) {
        // Allocate pixel buffer (ARGB format, 4 bytes per pixel)
        size_t pixelCount = width * height;
        fPixels = new GPixel[pixelCount];

        // Initialize to transparent black
        memset(fPixels, 0, pixelCount * sizeof(GPixel));

        // Create bitmap pointing to our buffer
        size_t rowBytes = width * sizeof(GPixel);
        fBitmap.reset(width, height, rowBytes, fPixels, GBitmap::kNo_IsOpaque);

        // Create canvas from bitmap
        fCanvas = GCreateCanvas(fBitmap);
    }

    ~CanvasWrapper() {
        delete[] fPixels;
    }

    // Get pointer to pixel buffer (for JavaScript to read)
    uintptr_t getPixelsPtr() const {
        return reinterpret_cast<uintptr_t>(fPixels);
    }

    int getWidth() const { return fWidth; }

    /** Arbitrary affine transform - shear and skew, which translate/scale/rotate
     *  cannot express. Matrix order is (a,c,e,b,d,f), as GMatrix declares it. */
    void concat(float m0, float m1, float m2, float m3, float m4, float m5) {
        fCanvas->concat(GMatrix(m0, m1, m2, m3, m4, m5));
    }
    int getHeight() const { return fHeight; }

    // Canvas state management
    void save() { fCanvas->save(); }
    void restore() { fCanvas->restore(); }

    // Transformations
    void translate(float x, float y) { fCanvas->translate(x, y); }
    void scale(float sx, float sy) { fCanvas->scale(sx, sy); }
    void rotate(float radians) { fCanvas->rotate(radians); }

    // Clear canvas
    void clear(float r, float g, float b, float a) {
        fCanvas->clear(GColor::RGBA(r, g, b, a));
    }

    // Draw with PaintWrapper
    void drawRectWithPaint(float x, float y, float width, float height, const PaintWrapper* paint) {
        GRect rect = GRect::XYWH(x, y, width, height);
        fCanvas->drawRect(rect, paint->getPaint());
    }

    void drawConvexPolygonWithPaint(const std::vector<float>& points, const PaintWrapper* paint) {
        size_t count = points.size() / 2;
        std::vector<GPoint> gpoints(count);
        for (size_t i = 0; i < count; ++i) {
            gpoints[i] = GPoint{points[i * 2], points[i * 2 + 1]};
        }
        fCanvas->drawConvexPolygon(gpoints.data(), count, paint->getPaint());
    }

    void drawPathWithPaint(const PathWrapper& path, const PaintWrapper* paint) {
        fCanvas->drawPath(path.getPath(), paint->getPaint());
    }

    void drawMesh(const std::vector<float>& verts,
                  const std::vector<float>& colors,
                  const std::vector<float>& texs,
                  const std::vector<int>& indices,
                  const PaintWrapper* paint) {
        // Convert verts
        size_t vertCount = verts.size() / 2;
        std::vector<GPoint> gverts(vertCount);
        for (size_t i = 0; i < vertCount; ++i) {
            gverts[i] = GPoint{verts[i * 2], verts[i * 2 + 1]};
        }

        // Convert colors (if provided)
        std::vector<GColor> gcolors;
        const GColor* colorPtr = nullptr;
        if (!colors.empty()) {
            size_t colorCount = colors.size() / 4;
            gcolors.resize(colorCount);
            for (size_t i = 0; i < colorCount; ++i) {
                gcolors[i] = GColor::RGBA(colors[i*4], colors[i*4+1], colors[i*4+2], colors[i*4+3]);
            }
            colorPtr = gcolors.data();
        }

        // Convert texs (if provided)
        std::vector<GPoint> gtexs;
        const GPoint* texPtr = nullptr;
        if (!texs.empty()) {
            size_t texCount = texs.size() / 2;
            gtexs.resize(texCount);
            for (size_t i = 0; i < texCount; ++i) {
                gtexs[i] = GPoint{texs[i * 2], texs[i * 2 + 1]};
            }
            texPtr = gtexs.data();
        }

        fCanvas->drawMesh(gverts.data(), colorPtr, texPtr,
                          indices.size() / 3, indices.data(), paint->getPaint());
    }

    void drawQuad(const std::vector<float>& verts,
                  const std::vector<float>& colors,
                  const std::vector<float>& texs,
                  int level,
                  const PaintWrapper* paint) {
        if (verts.size() != 8) return; // Need exactly 4 points (8 floats)

        GPoint gverts[4];
        for (int i = 0; i < 4; ++i) {
            gverts[i] = GPoint{verts[i * 2], verts[i * 2 + 1]};
        }

        GColor gcolors[4];
        const GColor* colorPtr = nullptr;
        if (colors.size() == 16) { // 4 colors * RGBA
            for (int i = 0; i < 4; ++i) {
                gcolors[i] = GColor::RGBA(colors[i*4], colors[i*4+1], colors[i*4+2], colors[i*4+3]);
            }
            colorPtr = gcolors;
        }

        GPoint gtexs[4];
        const GPoint* texPtr = nullptr;
        if (texs.size() == 8) { // 4 points
            for (int i = 0; i < 4; ++i) {
                gtexs[i] = GPoint{texs[i * 2], texs[i * 2 + 1]};
            }
            texPtr = gtexs;
        }

        fCanvas->drawQuad(gverts, colorPtr, texPtr, level, paint->getPaint());
    }

    /** Coons patch: four quadratic boundary curves (8 control points) with texture
     *  coordinates at the four corners. Implemented as a MyFinal override that lowers
     *  to drawMesh internally, so it needs a GFinal instance rather than a canvas call.
     *
     *  level 0 is a degenerate no-op in the implementation, so callers should pass >= 1. */
    void drawQuadraticCoons(const std::vector<float>& pts,
                            const std::vector<float>& texs,
                            int level,
                            const PaintWrapper* paint) {
        if (pts.size() != 16) return;   // 8 control points
        if (texs.size() != 8)  return;  // 4 corner texture coords

        GPoint gpts[8];
        for (int i = 0; i < 8; ++i) {
            gpts[i] = GPoint{pts[i * 2], pts[i * 2 + 1]};
        }
        GPoint gtex[4];
        for (int i = 0; i < 4; ++i) {
            gtex[i] = GPoint{texs[i * 2], texs[i * 2 + 1]};
        }

        auto final = GCreateFinal();
        if (!final) return;
        final->drawQuadraticCoons(fCanvas.get(), gpts, gtex, level, paint->getPaint());
    }

    // Legacy simple color methods (for backward compatibility)
    void drawRect(float x, float y, float width, float height,
                  float r, float g, float b, float a) {
        GRect rect = GRect::XYWH(x, y, width, height);
        GPaint paint(GColor::RGBA(r, g, b, a));
        fCanvas->drawRect(rect, paint);
    }

    void drawConvexPolygon(const std::vector<float>& points,
                           float r, float g, float b, float a) {
        size_t count = points.size() / 2;
        std::vector<GPoint> gpoints(count);
        for (size_t i = 0; i < count; ++i) {
            gpoints[i] = GPoint{points[i * 2], points[i * 2 + 1]};
        }

        GPaint paint(GColor::RGBA(r, g, b, a));
        fCanvas->drawConvexPolygon(gpoints.data(), count, paint);
    }

private:
    int fWidth;
    int fHeight;
    GPixel* fPixels;
    GBitmap fBitmap;
    std::unique_ptr<GCanvas> fCanvas;
};

// Factory functions for shaders
ShaderWrapper* createLinearGradient(float x0, float y0, float x1, float y1,
                                    const std::vector<float>& colors, int tileMode) {
    GPoint p0{x0, y0};
    GPoint p1{x1, y1};

    // Convert colors
    size_t count = colors.size() / 4;
    std::vector<GColor> gcolors(count);
    for (size_t i = 0; i < count; ++i) {
        gcolors[i] = GColor::RGBA(colors[i*4], colors[i*4+1], colors[i*4+2], colors[i*4+3]);
    }

    auto shader = GCreateLinearGradient(p0, p1, gcolors.data(), count,
                                        static_cast<GTileMode>(tileMode));
    if (shader) {
        return new ShaderWrapper(std::move(shader));
    }
    return nullptr;
}

ShaderWrapper* createRadialGradient(float centerX, float centerY, float radius,
                                    const std::vector<float>& colors, int tileMode) {
    GPoint center{centerX, centerY};

    // Convert colors
    size_t count = colors.size() / 4;
    std::vector<GColor> gcolors(count);
    for (size_t i = 0; i < count; ++i) {
        gcolors[i] = GColor::RGBA(colors[i*4], colors[i*4+1], colors[i*4+2], colors[i*4+3]);
    }

    auto shader = GCreateRadialGradientShader(center, radius, gcolors.data(), count,
                                              static_cast<GTileMode>(tileMode));
    if (shader) {
        return new ShaderWrapper(std::move(shader));
    }
    return nullptr;
}

ShaderWrapper* createAngleGradient(float x0, float y0, float x1, float y1,
                                  const std::vector<float>& colors) {
    GPoint p0{x0, y0};
    GPoint p1{x1, y1};

    // Convert colors
    size_t count = colors.size() / 4;
    std::vector<GColor> gcolors(count);
    for (size_t i = 0; i < count; ++i) {
        gcolors[i] = GColor::RGBA(colors[i*4], colors[i*4+1], colors[i*4+2], colors[i*4+3]);
    }

    auto shader = GCreateAngleGradientShader(p0, p1, gcolors.data(), count);
    if (shader) {
        return new ShaderWrapper(std::move(shader));
    }
    return nullptr;
}

ShaderWrapper* createBitmapShaderFromFile(const std::string& filename,
                                          float m0, float m1, float m2,
                                          float m3, float m4, float m5,
                                          int tileMode) {
    // Decoded once per filename - see cachedBitmap() on why this must not re-decode.
    GBitmap* bitmap = cachedBitmap(filename);
    if (!bitmap) {
        return nullptr;
    }

    // Create matrix from 6 values (affine transform)
    GMatrix matrix(m0, m1, m2, m3, m4, m5);

    auto shader = GCreateBitmapShader(*bitmap, matrix, static_cast<GTileMode>(tileMode));
    if (shader) {
        return new ShaderWrapper(std::move(shader));
    }
    return nullptr;
}

// Helper to load image from URL and store in virtual FS
// This will be called from JavaScript
bool loadImageToVFS(const std::string& filename, uintptr_t dataPtr, size_t dataSize) {
    // Write data to virtual filesystem
    FILE* f = fopen(filename.c_str(), "wb");
    if (!f) return false;

    const uint8_t* data = reinterpret_cast<const uint8_t*>(dataPtr);
    size_t written = fwrite(data, 1, dataSize, f);
    fclose(f);

    return written == dataSize;
}

// Debug helper to test file reading
int testFileRead(const std::string& filename) {
    // Try to open file
    FILE* f = fopen(filename.c_str(), "rb");
    if (!f) return -1;  // File open failed

    // Get file size
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);

    // Read first 8 bytes to check PNG signature
    uint8_t header[8];
    size_t read = fread(header, 1, 8, f);
    fclose(f);

    if (read != 8) return -2;  // Read failed

    // Check PNG signature: 137 80 78 71 13 10 26 10
    if (header[0] == 137 && header[1] == 80 && header[2] == 78 && header[3] == 71) {
        return (int)size;  // Success - return file size
    }

    return -3;  // Not a PNG
}

// Emscripten bindings

/* ---------------------------------------------------------------------------
 * Newly exposed surface. Every function below was already implemented in the
 * engine but had no embind entry, so JavaScript could not reach it.
 * ------------------------------------------------------------------------- */

/** Bilinear-filtered texture sampling - the quality tier above the nearest-neighbour
 *  createBitmapShaderFromFile. Same arguments so the two are drop-in comparable. */
ShaderWrapper* createBilerpBitmapShaderFromFile(const std::string& filename,
                                                float m0, float m1, float m2,
                                                float m3, float m4, float m5,
                                                int tileMode) {
    GBitmap* bitmap = cachedBitmap(filename);
    if (!bitmap) {
        return nullptr;
    }
    GMatrix matrix(m0, m1, m2, m3, m4, m5);
    auto shader = GCreateBilerpBitmapShader(*bitmap, matrix, static_cast<GTileMode>(tileMode));
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** Barycentric interpolation across a triangle. drawMesh builds this internally;
 *  exposing it lets a caller shade any geometry with a 3-point colour ramp. */
ShaderWrapper* createTriColorShader(const std::vector<float>& points,
                                    const std::vector<float>& colors) {
    auto pts = toPoints(points);
    auto cols = toColors(colors);
    if (pts.size() < 3 || cols.size() < 3) return nullptr;
    auto shader = GCreateTriColorShader(pts.data(), cols.data(), (int)pts.size());
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** Wraps an existing shader with a local matrix. The wrapped shader must outlive
 *  the proxy - JS owns both ShaderWrappers, so keep a reference to each. */
ShaderWrapper* createProxyShader(uintptr_t shaderPtr,
                                 float m0, float m1, float m2,
                                 float m3, float m4, float m5) {
    GShader* inner = reinterpret_cast<GShader*>(shaderPtr);
    if (!inner) return nullptr;
    GMatrix matrix(m0, m1, m2, m3, m4, m5);
    auto shader = GCreateProxyShader(inner, matrix);
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** Multiplies two shaders. Both inputs must outlive the composed shader. */
ShaderWrapper* createComposeShader(uintptr_t shaderA, uintptr_t shaderB) {
    GShader* a = reinterpret_cast<GShader*>(shaderA);
    GShader* b = reinterpret_cast<GShader*>(shaderB);
    if (!a || !b) return nullptr;
    auto shader = GCreateComposeShader(a, b);
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** Gradient whose stops sit at caller-chosen intervals rather than evenly spaced.
 *  intervals.size() is expected to match the colour count. */
ShaderWrapper* createNonlinearGradient(float x0, float y0, float x1, float y1,
                                       const std::vector<float>& colors,
                                       const std::vector<float>& intervals,
                                       int tileMode) {
    auto cols = toColors(colors);
    if (cols.empty() || intervals.size() < cols.size()) return nullptr;
    auto shader = GCreateNonlinearGradientShader(GPoint{x0, y0}, GPoint{x1, y1},
                                                 cols.data(), intervals.data(),
                                                 (int)cols.size(),
                                                 static_cast<GTileMode>(tileMode));
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** Position-controlled gradient: pos[i] places colour i at an explicit fraction of
 *  the p0->p1 line. Implemented as a MyFinal override, so it goes through GCreateFinal. */
ShaderWrapper* createLinearPosGradient(float x0, float y0, float x1, float y1,
                                       const std::vector<float>& colors,
                                       const std::vector<float>& pos) {
    auto cols = toColors(colors);
    if (cols.empty() || pos.size() < cols.size()) return nullptr;
    auto final = GCreateFinal();
    if (!final) return nullptr;
    auto shader = final->createLinearPosGradient(GPoint{x0, y0}, GPoint{x1, y1},
                                                 cols.data(), pos.data(), (int)cols.size());
    return shader ? new ShaderWrapper(std::move(shader)) : nullptr;
}

/** de Casteljau subdivision, exposed so a caller can show where a curve splits.
 *  Returns the flattened result: 5 points for a quad, 7 for a cubic. */
std::vector<float> chopQuadAt(const std::vector<float>& src, float t) {
    auto pts = toPoints(src);
    if (pts.size() < 3) return {};
    GPoint dst[5];
    GPath::ChopQuadAt(pts.data(), dst, t);
    std::vector<float> out;
    for (int i = 0; i < 5; ++i) { out.push_back(dst[i].x); out.push_back(dst[i].y); }
    return out;
}

std::vector<float> chopCubicAt(const std::vector<float>& src, float t) {
    auto pts = toPoints(src);
    if (pts.size() < 4) return {};
    GPoint dst[7];
    GPath::ChopCubicAt(pts.data(), dst, t);
    std::vector<float> out;
    for (int i = 0; i < 7; ++i) { out.push_back(dst[i].x); out.push_back(dst[i].y); }
    return out;
}

/** Matrix inversion and point mapping. invert() returns an optional in C++; an empty
 *  vector here means the matrix was singular, which the caller must handle. */
std::vector<float> invertMatrix(float m0, float m1, float m2, float m3, float m4, float m5) {
    GMatrix m(m0, m1, m2, m3, m4, m5);
    auto inv = m.invert();
    if (!inv) return {};
    return { (*inv)[0], (*inv)[1], (*inv)[2], (*inv)[3], (*inv)[4], (*inv)[5] };
}

std::vector<float> mapPoints(float m0, float m1, float m2, float m3, float m4, float m5,
                             const std::vector<float>& points) {
    GMatrix m(m0, m1, m2, m3, m4, m5);
    auto pts = toPoints(points);
    if (pts.empty()) return {};
    std::vector<GPoint> dst(pts.size());
    m.mapPoints(dst.data(), pts.data(), (int)pts.size());
    std::vector<float> out;
    for (const auto& p : dst) { out.push_back(p.x); out.push_back(p.y); }
    return out;
}

EMSCRIPTEN_BINDINGS(graphics_engine) {
    // PathWrapper
    class_<PathWrapper>("PathWrapper")
        .constructor<>()
        .function("reset", &PathWrapper::reset)
        .function("moveTo", &PathWrapper::moveTo)
        .function("lineTo", &PathWrapper::lineTo)
        .function("quadTo", &PathWrapper::quadTo)
        .function("cubicTo", &PathWrapper::cubicTo)
        .function("addRect", &PathWrapper::addRect)
        .function("addCircle", &PathWrapper::addCircle)
        .function("addPolygon", &PathWrapper::addPolygon)
        .function("countPoints", &PathWrapper::countPoints)
        .function("transform", &PathWrapper::transform)
        .function("boundsLeft", &PathWrapper::boundsLeft)
        .function("boundsTop", &PathWrapper::boundsTop)
        .function("boundsRight", &PathWrapper::boundsRight)
        .function("boundsBottom", &PathWrapper::boundsBottom);

    // PaintWrapper
    class_<PaintWrapper>("PaintWrapper")
        .constructor<>()
        .function("setColor", &PaintWrapper::setColor)
        .function("setAlpha", &PaintWrapper::setAlpha)
        .function("setBlendMode", &PaintWrapper::setBlendMode)
        .function("setShader", &PaintWrapper::setShader, allow_raw_pointers())
        .function("getColorR", &PaintWrapper::getColorR)
        .function("getColorG", &PaintWrapper::getColorG)
        .function("getColorB", &PaintWrapper::getColorB)
        .function("getColorA", &PaintWrapper::getColorA);

    // ShaderWrapper
    class_<ShaderWrapper>("ShaderWrapper")
        .function("getPtr", &ShaderWrapper::getPtr);

    // CanvasWrapper with extended API
    class_<CanvasWrapper>("CanvasWrapper")
        .constructor<int, int>()
        .function("getPixelsPtr", &CanvasWrapper::getPixelsPtr)
        .function("getWidth", &CanvasWrapper::getWidth)
        .function("getHeight", &CanvasWrapper::getHeight)
        .function("save", &CanvasWrapper::save)
        .function("restore", &CanvasWrapper::restore)
        .function("translate", &CanvasWrapper::translate)
        .function("scale", &CanvasWrapper::scale)
        .function("rotate", &CanvasWrapper::rotate)
        .function("concat", &CanvasWrapper::concat)
        .function("clear", &CanvasWrapper::clear)
        // Paint-based drawing
        .function("drawRectWithPaint", &CanvasWrapper::drawRectWithPaint, allow_raw_pointers())
        .function("drawConvexPolygonWithPaint", &CanvasWrapper::drawConvexPolygonWithPaint, allow_raw_pointers())
        .function("drawPathWithPaint", &CanvasWrapper::drawPathWithPaint, allow_raw_pointers())
        .function("drawMesh", &CanvasWrapper::drawMesh, allow_raw_pointers())
        .function("drawQuad", &CanvasWrapper::drawQuad, allow_raw_pointers())
        .function("drawQuadraticCoons", &CanvasWrapper::drawQuadraticCoons, allow_raw_pointers())
        // Legacy simple color methods
        .function("drawRect", &CanvasWrapper::drawRect)
        .function("drawConvexPolygon", &CanvasWrapper::drawConvexPolygon);

    // Shader factory functions
    function("createLinearGradient", &createLinearGradient, allow_raw_pointers());
    function("createRadialGradient", &createRadialGradient, allow_raw_pointers());
    function("createAngleGradient", &createAngleGradient, allow_raw_pointers());
    function("createBitmapShaderFromFile", &createBitmapShaderFromFile, allow_raw_pointers());
    function("loadImageToVFS", &loadImageToVFS);
    function("testFileRead", &testFileRead);

    // Newly exposed: implemented in the engine, previously unreachable from JS
    function("createBilerpBitmapShaderFromFile", &createBilerpBitmapShaderFromFile, allow_raw_pointers());
    function("createTriColorShader", &createTriColorShader, allow_raw_pointers());
    function("createProxyShader", &createProxyShader, allow_raw_pointers());
    function("createComposeShader", &createComposeShader, allow_raw_pointers());
    function("createNonlinearGradient", &createNonlinearGradient, allow_raw_pointers());
    function("createLinearPosGradient", &createLinearPosGradient, allow_raw_pointers());
    function("chopQuadAt", &chopQuadAt);
    function("chopCubicAt", &chopCubicAt);
    function("invertMatrix", &invertMatrix);
    function("mapPoints", &mapPoints);

    // Enums
    enum_<GBlendMode>("BlendMode")
        .value("Clear", GBlendMode::kClear)
        .value("Src", GBlendMode::kSrc)
        .value("Dst", GBlendMode::kDst)
        .value("SrcOver", GBlendMode::kSrcOver)
        .value("DstOver", GBlendMode::kDstOver)
        .value("SrcIn", GBlendMode::kSrcIn)
        .value("DstIn", GBlendMode::kDstIn)
        .value("SrcOut", GBlendMode::kSrcOut)
        .value("DstOut", GBlendMode::kDstOut)
        .value("SrcATop", GBlendMode::kSrcATop)
        .value("DstATop", GBlendMode::kDstATop)
        .value("Xor", GBlendMode::kXor);

    enum_<GTileMode>("TileMode")
        .value("Clamp", GTileMode::kClamp)
        .value("Repeat", GTileMode::kRepeat)
        .value("Mirror", GTileMode::kMirror);

    enum_<GPath::Direction>("PathDirection")
        .value("CW", GPath::kCW_Direction)
        .value("CCW", GPath::kCCW_Direction);

    // Register vector types for array passing
    register_vector<float>("VectorFloat");
    register_vector<int>("VectorInt");
}
