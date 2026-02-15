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
#include <memory>
#include <vector>

// Forward declare shader factory functions from shader_ops.h
std::unique_ptr<GShader> GCreateRadialGradientShader(const GPoint& center, float radius, const GColor colors[], int count, GTileMode tileMode);
std::unique_ptr<GShader> GCreateAngleGradientShader(GPoint p0, GPoint p1, const GColor colors[], int count);

using namespace emscripten;

/**
 * PathWrapper - JavaScript-friendly wrapper for GPath
 */
class PathWrapper {
public:
    PathWrapper() {}

    void reset() { fPath.reset(); }
    void moveTo(float x, float y) { fPath.moveTo(x, y); }
    void lineTo(float x, float y) { fPath.lineTo(x, y); }
    void quadTo(float x1, float y1, float x2, float y2) { fPath.quadTo(x1, y1, x2, y2); }
    void cubicTo(float x1, float y1, float x2, float y2, float x3, float y3) {
        fPath.cubicTo(x1, y1, x2, y2, x3, y3);
    }

    void addRect(float x, float y, float width, float height, int direction) {
        GRect rect = GRect::XYWH(x, y, width, height);
        fPath.addRect(rect, static_cast<GPath::Direction>(direction));
    }

    void addCircle(float centerX, float centerY, float radius, int direction) {
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

    void setBlendMode(int mode) {
        fPaint.setBlendMode(static_cast<GBlendMode>(mode));
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
    // Load bitmap from virtual filesystem
    GBitmap bitmap;
    if (!bitmap.readFromFile(filename.c_str())) {
        return nullptr;
    }

    // Create matrix from 6 values (affine transform)
    GMatrix matrix(m0, m1, m2, m3, m4, m5);

    auto shader = GCreateBitmapShader(bitmap, matrix, static_cast<GTileMode>(tileMode));
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
        .function("countPoints", &PathWrapper::countPoints);

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
        .function("clear", &CanvasWrapper::clear)
        // Paint-based drawing
        .function("drawRectWithPaint", &CanvasWrapper::drawRectWithPaint, allow_raw_pointers())
        .function("drawConvexPolygonWithPaint", &CanvasWrapper::drawConvexPolygonWithPaint, allow_raw_pointers())
        .function("drawPathWithPaint", &CanvasWrapper::drawPathWithPaint, allow_raw_pointers())
        .function("drawMesh", &CanvasWrapper::drawMesh, allow_raw_pointers())
        .function("drawQuad", &CanvasWrapper::drawQuad, allow_raw_pointers())
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
