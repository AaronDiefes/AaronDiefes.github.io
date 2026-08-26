// Quick blend mode test
#include "include/GCanvas.h"
#include "include/GBitmap.h"
#include "include/GPaint.h"
#include "include/GColor.h"
#include "include/GRect.h"
#include "include/GBlendMode.h"
#include <memory>
#include <cstdio>

int main() {
    // Create 500x500 bitmap
    GPixel pixels[500 * 500];
    GBitmap bitmap(500, 500, 500 * sizeof(GPixel), pixels, GBitmap::kNo_IsOpaque);

    auto canvas = GCreateCanvas(bitmap);

    // Clear to white
    canvas->clear(GColor::RGBA(1, 1, 1, 1));

    // Blue rect (destination) - semi-transparent
    GPaint bluePaint(GColor::RGBA(0.2f, 0.5f, 1.0f, 0.7f));
    canvas->drawRect(GRect::XYWH(200, 200, 200, 200), bluePaint);

    // Red rect (source) with Xor - semi-transparent
    GPaint redPaint(GColor::RGBA(1.0f, 0.3f, 0.3f, 0.7f));
    redPaint.setBlendMode(GBlendMode::kXor);
    canvas->drawRect(GRect::XYWH(300, 250, 200, 200), redPaint);

    // Check a few key pixels
    GPixel* row = bitmap.getAddr(0, 300);  // Middle row

    printf("Pixel at (250, 300) - blue only: A=%d R=%d G=%d B=%d\n",
        GPixel_GetA(row[250]), GPixel_GetR(row[250]),
        GPixel_GetG(row[250]), GPixel_GetB(row[250]));

    printf("Pixel at (350, 300) - overlap: A=%d R=%d G=%d B=%d\n",
        GPixel_GetA(row[350]), GPixel_GetR(row[350]),
        GPixel_GetG(row[350]), GPixel_GetB(row[350]));

    printf("Pixel at (450, 300) - red only: A=%d R=%d G=%d B=%d\n",
        GPixel_GetA(row[450]), GPixel_GetR(row[450]),
        GPixel_GetG(row[450]), GPixel_GetB(row[450]));

    // Save to file if possible
    bitmap.writeToFile("test_blend_xor.png");
    printf("Saved to test_blend_xor.png\n");

    return 0;
}
