/**
 * WebAssembly bindings for 2D Graphics Engine
 * Exposes C++ graphics API to JavaScript via Emscripten
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

using namespace emscripten;

/**
 * CanvasWrapper - Manages a GCanvas instance with its backing bitmap
 *
 * This wrapper owns the pixel buffer and provides JavaScript-friendly
 * methods to interact with the C++ graphics engine.
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

    // Draw rectangle
    void drawRect(float x, float y, float width, float height,
                  float r, float g, float b, float a) {
        GRect rect = GRect::XYWH(x, y, width, height);
        GPaint paint(GColor::RGBA(r, g, b, a));
        fCanvas->drawRect(rect, paint);
    }

    // Draw convex polygon
    void drawConvexPolygon(const std::vector<float>& points,
                           float r, float g, float b, float a) {
        // Convert flat array to GPoint array
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

// Emscripten bindings
EMSCRIPTEN_BINDINGS(graphics_engine) {
    // Register CanvasWrapper class
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
        .function("drawRect", &CanvasWrapper::drawRect)
        .function("drawConvexPolygon", &CanvasWrapper::drawConvexPolygon);

    // Register vector types for array passing
    register_vector<float>("VectorFloat");
}
