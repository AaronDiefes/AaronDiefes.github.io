#include "include/GBitmap.h"
#include "include/GCanvas.h"
#include "include/GColor.h"
#include "include/GMath.h"
#include "include/GPath.h"
#include "include/GPixel.h"
#include "include/GPoint.h"
#include "include/GRandom.h"
#include "include/GRect.h"
#include "include/GTime.h"
#include "include/GTypes.h"
#include "include/GShader.h"
// #include "starter_canvas.h"
// #include "Edge.h"
// #include "my_utils.h"
// #include "blend_functions.h"
// #include "shader_ops.h"
// #include <iostream>
// #include "path_ops.h"
#include "include/GFinal.h"

class LinearPosGradientShader:public GShader{
    public:
        GPixel unpremult(GColor color){
            int r = GRoundToInt(color.r * color.a * 255);
            int g = GRoundToInt(color.g * color.a * 255);
            int b = GRoundToInt(color.b * color.a * 255);
            int a = GRoundToInt(color.a * 255);
            return GPixel_PackARGB(a, r, g, b);
        }

        LinearPosGradientShader(GPoint p0, GPoint p1, const GColor colors[], const float pos[], int count) : P0(p0), P1(p1), count(count){
            for(int i = 0; i < count; i++){
                gradient_colors.push_back(colors[i]);
                positions.push_back(pos[i]);
            }

            gradient_colors.push_back(colors[count - 1]);

        }

        bool isOpaque() override{
            return false;
        }

        bool setContext(const GMatrix& ctm) override {

            GMatrix transform = GMatrix(
                P1.x - P0.x,    -(P1.y - P0.y),   P0.x,
                P1.y - P0.y,    P1.x - P0.x,      P0.y
            );
            GMatrix m = ctm * transform;
            if (auto inverse = m.invert()) {
                inv = *inverse;
                return true;
            }
            return false;
        }

        void shadeRow(int x, int y, int c, GPixel row[]) override{
            float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]) * (count - 1);
            float currX = x_prime;
            float prop;

            int k;
            GColor mix;

            for (int i = 0; i < c; i++){
                currX = x_prime;

                if (currX < 0) currX = 0;
                if (currX > count - 1) currX = count - 1;

                prop = currX / (count - 1);
                k = 0;

                while (true) {
                if (prop > positions[k]) {
                    k++;
                } else {
                    break;
                }
                }
                assert(prop <= positions[k]);

                float fullDiff;
                float propDiff;

                if (k == 0) {
                    mix = gradient_colors[k];
                } else if (k < count) {

                    fullDiff = positions[k] - positions[k - 1];
                    propDiff = prop - positions[k - 1];
                    
                    float propC1 = propDiff / fullDiff;
                    assert(propC1 >= 0.0f && propC1 <= 1.0f);

                    mix = gradient_colors[k] * propC1 + gradient_colors[k - 1] * (1.0f - propC1);

                } else {
                    mix = gradient_colors[k - 1];
                }
                row[i] = unpremult(mix);
                x_prime += inv[0] * (count - 1);
           }
        }

    private:
        GPoint P0;
        GPoint P1;
        int count;
        std::vector<GColor> gradient_colors {};
        std::vector<float> positions {};
        GMatrix inv;

};

class MyFinal : public GFinal {
    void drawQuadraticCoons(GCanvas* canvas, const GPoint pts[8], const GPoint tex[4],
                                    int level, const GPaint& paint) override {
        if (level == 0) {
            return;
        }
        int quadCount = pow(level + 1, 2);
        float inc = 1.0f / (level + 1);

        GPoint new_pts[quadCount * 4];
        GPoint texts[quadCount * 4];

        int indices[quadCount * 6];

        int c = 0;
        int idx = 0;
        float v = 0.0f;

        for(int i = 0; i <= level; i++){
            float u = 0.0f;
            for(int j = 0; j <= level; j++){
                new_pts[c]   = pt_coons_avg(u,      v,     pts);
                new_pts[c+1] = pt_coons_avg(u+inc, v,      pts);
                new_pts[c+2] = pt_coons_avg(u,      v+inc, pts);
                new_pts[c+3] = pt_coons_avg(u+inc, v+inc, pts);

                texts[c]   = pt_weighted_avg(u,      v,      tex[0], tex[1], tex[2], tex[3]);
                texts[c+1] = pt_weighted_avg(u+inc,  v,      tex[0], tex[1], tex[2], tex[3]);
                texts[c+2] = pt_weighted_avg(u,      v+inc,  tex[0], tex[1], tex[2], tex[3]);
                texts[c+3] = pt_weighted_avg(u+inc,  v+inc,  tex[0], tex[1], tex[2], tex[3]);

                indices[idx] = c;       indices[idx+1] = c+1;       indices[idx+2] = c+2;
                indices[idx+3] = c+1;   indices[idx+4] = c+2;       indices[idx+5] = c+3;

                u += inc;
                c += 4;
                idx += 6;
            }
        v += inc;
        }
        canvas->drawMesh(new_pts, nullptr, texts, quadCount * 2, indices, paint);
    }

    GPoint pt_weighted_avg(float u, float v, GPoint p1, GPoint p2, GPoint p3, GPoint p4){
        GPoint p = (1-u)*(1-v)* p1 + u * (1-v) * p2 + u * v * p3 + (1-u) * v * p4;
        return p;
    }

    GPoint get_quad_bezier(const GPoint* curr_points, float t){
        GPoint tangent;

        tangent.x = curr_points[0].x * pow(1-t, 2) + 2 * curr_points[1].x * t * (1-t) + curr_points[2].x * t * t;
        tangent.y = curr_points[0].y * pow(1-t, 2) + 2 * curr_points[1].y * t * (1-t) + curr_points[2].y * t * t;
        
        return tangent;
    }
    GPoint pt_coons_avg(float u, float v, const GPoint pts[8]) {
        if (u == 0.0f && v == 0.0f) return pts[0];
        if (u == 1.0f && v == 0.0f) return pts[2];
        if (u == 1.0f && v == 1.0f) return pts[4];
        if (u == 0.0f && v == 1.0f) return pts[6];

        GPoint top[3] = {pts[0], pts[1], pts[2]};
        GPoint right[3] = {pts[2], pts[3], pts[4]};
        GPoint bottom[3] = {pts[6], pts[5], pts[4]};
        GPoint left[3] = {pts[0], pts[7], pts[6]};

        if (u == 0.0f) return get_quad_bezier(left, v);
        if (u == 1.0f) return get_quad_bezier(right, v);
        if (v == 0.0f) return get_quad_bezier(top, u);
        if (v == 1.0f) return get_quad_bezier(bottom, u);

        GPoint a = get_quad_bezier(top, u);
        GPoint b = get_quad_bezier(bottom, u);

        GPoint ab = {a.x + ((b.x - a.x) * v), a.y + ((b.y - a.y) * v)};

        GPoint c = get_quad_bezier(left, v);
        GPoint d = get_quad_bezier(right, v);

        GPoint cd = {c.x + ((d.x - c.x) * u), c.y + ((d.y - c.y) * u)};

        GPoint mid = pt_weighted_avg(u, v, pts[0], pts[2], pts[4], pts[6]);

        return (ab + cd) - mid;
    }

    GPixel unpremult(GColor color){
            int r = GRoundToInt(color.r * color.a * 255);
            int g = GRoundToInt(color.g * color.a * 255);
            int b = GRoundToInt(color.b * color.a * 255);
            int a = GRoundToInt(color.a * 255);
            return GPixel_PackARGB(a, r, g, b);
    }

    std::unique_ptr<GShader> createLinearPosGradient(GPoint p0, GPoint p1, const GColor colors[], const float pos[], int count) override {
        return std::unique_ptr<GShader>(new LinearPosGradientShader(p0, p1, colors, pos, count));
    }
};


std::unique_ptr<GFinal> GCreateFinal() {
    return std::unique_ptr<GFinal>(new MyFinal);
}