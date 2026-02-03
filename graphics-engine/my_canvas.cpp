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
#include "starter_canvas.h"
#include "Edge.h"
#include "my_utils.h"
#include "blend_functions.h"
#include "shader_ops.h"
#include <iostream>
#include "path_ops.h"
// #include "shader_ops.cpp"



/*
 *  Copyright 2024 <me>
 */


void MyCanvas::clear(const GColor& color) {
    
    GPixel pixel = unpremult(color);
    BlendProc proc = src_mode;
    for(int i = 0; i < fDevice.height(); i++){
        blitRow(0, i, fDevice.width(), proc, fDevice, pixel);
    }
}

void MyCanvas::drawRect(const GRect& rect, const GPaint& paint) {

    GPoint p1 = {rect.left, rect.top};
    GPoint p2 = {rect.right, rect.top};
    GPoint p3 = {rect.right, rect.bottom};
    GPoint p4 = {rect.left, rect.bottom};

    GPoint src[4] = {p1, p2, p3, p4};
    drawConvexPolygon(src, 4, paint);
};

void MyCanvas::drawConvexPolygon(const GPoint points[], int count, const GPaint& paint){
    
    if(count < 3){
        return;
    }
    
    GPoint dst[count];
    GMatrix mat = ctm[ctm.size() - 1];

    mat.mapPoints(dst, points, count);
    
    std::vector<Edge> edges;
    
    //create array of edges
    for(int i = 0; i < count; i++){
        int nextIndex = (i + 1) % count; 
        Edge::clip(dst[i], dst[nextIndex], fDevice, edges);
    }

    if (edges.size() < 2){
        return;
    }

    //sort by top value
    std::sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {
        return a.top > b.top;
    });

    // for(int i = 0; i < edges.size(); i++){
    //     std::cout<<"edge top: "<<edges[i].top<<" edge bottom: "<<edges[i].bottom<<" edge slope: "<<edges[i].m<<" edge x: "<<edges[i].x<<std::endl;
    // }
    if(paint.getShader()){
        GShader* sh = paint.getShader();
        if(sh->setContext(ctm[ctm.size() - 1])){
            GBlendMode mode_type = paint.getBlendMode();
            BlendProc proc = gProcs[(int)mode_type];
            if(sh->isOpaque()){
                if(proc == src_over_mode){proc = src_mode;}
                // if(proc == src_over_mode){proc = dst_mode;}
                if(proc == dst_out_mode){proc = clear_mode;}
                if(proc == src_atop_mode){proc = src_in_mode;}
                if(proc == xor_mode){proc = src_out_mode;}
            }
            shadeFillPolygon(sh, edges, fDevice, ctm, proc);
        }
    }
    else{
        GColor color = paint.getColor();
        GBlendMode mode_type = paint.getBlendMode();
        BlendProc proc = gProcs[(int)mode_type];
        // BlendProc proc = getBlendMode(gProcs[(int)mode_type], color);

        if(color.a == 1){
            if(proc == src_over_mode){proc = src_mode;}
            // if(proc == src_over_mode){proc = dst_mode;}
            if(proc == dst_out_mode){proc = clear_mode;}
            if(proc == src_atop_mode){proc = src_in_mode;}
            if(proc == xor_mode){proc = src_out_mode;}
        }
        if(color.a == 0){
            if(proc == src_mode){proc = clear_mode;}
            if(proc == src_over_mode){proc = dst_mode;}
            if(proc == dst_over_mode){proc = dst_mode;}
            if(proc == src_in_mode){proc = clear_mode;}
            if(proc == dst_in_mode){proc = clear_mode;}
            if(proc == src_out_mode){proc = clear_mode;}
            // if(proc == dst_out_mode){proc = clear_mode;}
            if(proc == src_atop_mode){proc = dst_mode;}
            // if(proc == dst_atop_mode){proc = clear_mode;}
            if(proc == xor_mode){proc = dst_mode;}
        }
        fillPolygon(edges, color, proc, fDevice);
    }
}



std::unique_ptr<GCanvas> GCreateCanvas(const GBitmap& device) {
    return std::unique_ptr<GCanvas>(new MyCanvas(device));
}

void MyCanvas::save() {
    GMatrix top = ctm[ctm.size() - 1];
    ctm.push_back(top);
}

void MyCanvas::restore() {
    ctm.erase(ctm.end() -1);
}

void MyCanvas::concat(const GMatrix& matrix) {
    GMatrix& top = ctm.back();    
    top = GMatrix::Concat(top, matrix);
}

void MyCanvas::drawPath(const GPath& path, const GPaint& paint){
    
    GPixel src;
    BlendProc proc;
    if(paint.getShader()){
        GShader* sh = paint.getShader();
        if(sh->setContext(ctm[ctm.size() - 1])){
            GBlendMode mode_type = paint.getBlendMode();
            proc = gProcs[(int)mode_type];
            if(sh->isOpaque()){
                if(proc == src_over_mode){proc = src_mode;}
                // if(proc == src_over_mode){proc = dst_mode;}
                if(proc == dst_out_mode){proc = clear_mode;}
                if(proc == src_atop_mode){proc = src_in_mode;}
                if(proc == xor_mode){proc = src_out_mode;}
            }
        }
    }
    else{
        GColor color = paint.getColor();
        GBlendMode mode_type = paint.getBlendMode();
        proc = gProcs[(int)mode_type];
        // BlendProc proc = getBlendMode(gProcs[(int)mode_type], color);
        src = unpremult(color);
        // src = GPixel_PackARGB(255, 255, 0, 0);


        if(color.a == 1){
                if(proc == src_over_mode){proc = src_mode;}
                // if(proc == src_over_mode){proc = dst_mode;}
                if(proc == dst_out_mode){proc = clear_mode;}
                if(proc == src_atop_mode){proc = src_in_mode;}
                if(proc == xor_mode){proc = src_out_mode;}
        }
        if(color.a == 0){
            if(proc == src_mode){proc = clear_mode;}
            if(proc == src_over_mode){proc = dst_mode;}
            if(proc == dst_over_mode){proc = dst_mode;}
            if(proc == src_in_mode){proc = clear_mode;}
            if(proc == dst_in_mode){proc = clear_mode;}
            if(proc == src_out_mode){proc = clear_mode;}
            // if(proc == dst_out_mode){proc = clear_mode;}
            if(proc == src_atop_mode){proc = dst_mode;}
            // if(proc == dst_atop_mode){proc = clear_mode;}
            if(proc == xor_mode){proc = dst_mode;}
        }
    }
    //transform all points before creating edges
    GMatrix mat = ctm[ctm.size() - 1];
    GPath copy = path;
    copy.transform(mat);

    GPath::Edger edger(copy); 
    std::vector<Edge> edges;
    GPoint tempPoints[GPath::kMaxNextPoints];
    GPoint storage[1000];

    //whiile the current verb is not the stop verb
    while(auto verb = edger.next(tempPoints)) {
        switch(verb.value()){
            case GPath::kLine:  Edge::clip(tempPoints[0], tempPoints[1], fDevice, edges);
                break;
            case GPath::kQuad: {
                GPoint A = tempPoints[0];
                GPoint B = tempPoints[1];
                GPoint C = tempPoints[2];
                GPoint E = (A - 2*B + C)*.25f;
                float mag_E = sqrt(E.x*E.x + E.y*E.y);
                int num_segs = (int)ceil(sqrt(mag_E*4));

                storage[num_segs + 1];
                float dt = 1.0f/num_segs;
                float t = 0;
                storage[0] = A;
                for(int i = 1; i < num_segs; i++){
                    t += dt;
                    storage[i] = ((1-t)*(1-t)*A + 2*t*(1-t)*B + t*t*C);
                }
                storage[num_segs] = C;

                for(int i = 0; i < num_segs; i++){
                    Edge::clip(storage[i], storage[i+1], fDevice, edges);
                }         
                break;
            }
            case GPath::kCubic: {
                GPoint A = tempPoints[0];
                GPoint B = tempPoints[1];
                GPoint C = tempPoints[2];
                GPoint D = tempPoints[3];

                GPoint E0 = A - 2*B + C;
                GPoint E1 = B - 2*C + D;
                GPoint E;
                E.x = max(abs(E0.x), abs(E1.x));
                E.y = max(abs(E0.y), abs(E1.y));

                float mag_E = sqrt(E.x*E.x + E.y*E.y);
                int num_segs = (int)ceil(sqrt((3*mag_E)*16));


                storage[num_segs + 1];
                float dt = 1.0f/num_segs;
                float t = 0;
                storage[0] = A;

                for(int i = 1; i < num_segs; i++){
                    t += dt;
                    storage[i] = ((1-t)*(1-t)*(1-t) * A + 3 * (1-t)*(1-t) * t * B + 3 * (1-t) * t*t * C + t*t*t * D);
                }
                storage[num_segs] = D;
                for(int i = 0; i < num_segs; i++){
                    Edge::clip(storage[i], storage[i+1], fDevice, edges);
                }   
                break;
            }
        }
    }

    //first sort in y, then in x
    std::sort(edges.begin(), edges.end(), [](Edge& a, Edge& b) {
        if(a.top == b.top){
            //I think this is initial x, check later
            if(a.left_x == b.left_x){
                return a.m < b.m;
            }
            return a.left_x < b.left_x;
            // return a.eval(a.top) < b.eval(b.top);
        }
        return a.top < b.top;
    });

    // for(int i = 0; i < edges.size(); i++){
    //     std::cout<<"edge top: "<<edges[i].top<<" edge bottom: "<<edges[i].bottom<<" edge slope: "<<edges[i].m<<" edge x: "<<edges[i].x<<" edge dir: "<<edges[i].dir<<std::endl;
    // }

    GRect bound = copy.bounds();

    int yMin = 0;//bound.top;
    int yMax = fDevice.height(); // bound.bottom;


    //loop through all y values containing edges from top to bottom
    for(int y = yMin; y < yMax; y++){
        size_t i = 0;
        int w = 0;
        int L = 0;
        int R = 0;
        // std::cout<<" current y: "<<y<<std::endl;
        //loop through active edges an given y value
        while (i < edges.size() && edges[i].isValid(y)) {
            int x = GRoundToInt(edges[i].eval(y));
    
            if (w == 0) {
                L = x;
            }
            w += edges[i].dire;  
            if (w == 0) {
		        int R = x;
                if(paint.getShader()){
                    GShader* sh = paint.getShader();
                    if(sh->setContext(ctm[ctm.size() - 1])){
                        assert(R >= L);
                        // std::vector<GPixel> row;
                        GPixel row[R-L];

                        sh->shadeRow(L, y, R - L, row);
                        for(int j = 0; j < R-L; j++){
                            GBlendMode mode_type = paint.getBlendMode();
                            BlendProc proc = gProcs[(int)mode_type];
                            blitRow(L+j, y, 1, proc, fDevice, row[j]);
                        }
                        // shadeBlendRow(L, y, R-L, proc, fDevice, row);
                    }
                }
                else{
                    if(R-L > 0){
                        blitRow(L, y, R - L, proc, fDevice, src);

                    }
                }
            }

            if (edges[i].isValid(y+1)) {
                i += 1;
            } 

            else {
                edges.erase(edges.begin() + i);	// we’re done with this edge
            }
            // std::cout<<w<<std::endl;
        }

        assert(w == 0);
        // account for any new edges that will be valid for next y
        while (i < edges.size() && edges[i].isValid(y+1)) {
            i += 1;
        }
        // now i also includes the number of edges that will be valid
        
        //sort_edges( [0…i) based on computed X for y+1 )
        //right now, just sorts all edges 
        std::sort(edges.begin(), edges.begin() + i, [y](Edge& a, Edge& b) {
            assert(true);
            return GRoundToInt(a.eval(y+1)) < GRoundToInt(b.eval(y+1));
        });
        
        }
    }

    void MyCanvas::drawMesh(const GPoint verts[], const GColor colors[], const GPoint texs[], int count, const int indices[], const GPaint& paint)
    {
        // colors, no texs
        if(colors != nullptr && texs == nullptr){
            int n = 0;
            for(int i = 0; i < count; i++){
                GPoint p0 = verts[indices[n]];
                GPoint p1 = verts[indices[n+1]];
                GPoint p2 = verts[indices[n+2]];

                GColor c0 = colors[indices[n]];
                GColor c1 = colors[indices[n+1]];
                GColor c2 = colors[indices[n+2]]; 

                GPoint points[] = {p0, p1, p2};
                GColor colors[] = {c0, c1, c2};

                auto sh = GCreateTriColorShader(points, colors, count);
                GPaint p(sh.get());
                
                drawConvexPolygon(points, 3, p);
                n += 3;
            }
        }
        
        // texs, no colors
        if(colors == nullptr && texs != nullptr){
            int n = 0;
            for(int i = 0; i < count; i++){
                GPoint p0 = verts[indices[n+0]];
                GPoint p1 = verts[indices[n+1]];
                GPoint p2 = verts[indices[n+2]];

                GPoint t0 = texs[indices[n+0]];
                GPoint t1 = texs[indices[n+1]];
                GPoint t2 = texs[indices[n+2]];

                GPoint points[] = {p0, p1, p2};

                GMatrix T = GMatrix(
                    t1.x - t0.x,    t2.x - t0.x,    t0.x,
                    t1.y - t0.y,    t2.y - t0.y,    t0.y
                );

                GMatrix P = GMatrix(
                    p1.x - p0.x,    p2.x - p0.x,    p0.x,
                    p1.y - p0.y,    p2.y - p0.y,    p0.y
                );

                auto real_sh = paint.getShader();
                GMatrix invT;
                if(auto inverted = T.invert()){
                    invT = *inverted;
                }
                ProxyShader proxy(real_sh,(P * invT));
                GPaint p(&proxy);

                drawConvexPolygon(points, 3, p);
                n += 3;
            }

        }
        //colors and texs
        if(colors != nullptr && texs != nullptr){
            int n = 0;
            for(int i = 0; i < count; i++){
                GPoint p0 = verts[indices[n+0]];
                GPoint p1 = verts[indices[n+1]];
                GPoint p2 = verts[indices[n+2]];

                GColor c0 = colors[indices[n]];
                GColor c1 = colors[indices[n+1]];
                GColor c2 = colors[indices[n+2]]; 

                GPoint t0 = texs[indices[n+0]];
                GPoint t1 = texs[indices[n+1]];
                GPoint t2 = texs[indices[n+2]];

                GMatrix T_1 = GMatrix(
                    t1.x - t0.x,    t2.x - t0.x,    t0.x,
                    t1.y - t0.y,    t2.y - t0.y,    t0.y
                );

                GMatrix P_1 = GMatrix(
                    p1.x - p0.x,    p2.x - p0.x,    p0.x,
                    p1.y - p0.y,    p2.y - p0.y,    p0.y
                );

                GMatrix P_0 = GMatrix(
                    1/fDevice.width(),  0,                  0,
                    0,                  1/fDevice.height(), 0
                );

                GMatrix T_0 = GMatrix(
                    1/fDevice.width(),  0,                  0,
                    0,                  1/fDevice.height(), 0
                );

                GMatrix P = P_1 * P_0;
                GMatrix T = T_1 * T_0;

                GPoint points[] = {p0, p1, p2};
                GColor colors[] = {c0, c1, c2};

                auto sh1 = GCreateTriColorShader(points, colors, count);


                auto real_sh = paint.getShader();
                GMatrix invT;
                if(auto inverted = T_1.invert()){
                    invT = *inverted;
                }
                
                auto sh2 = GCreateProxyShader(real_sh, (P_1*invT));

                auto compose_shader = GCreateComposeShader(sh1.get(), sh2.get());
                GPaint p(compose_shader.get());

                drawConvexPolygon(points, 3, p);

                n += 3;

            }
        }
    }

    
        
    void MyCanvas::drawQuad(const GPoint verts[4], const GColor colors[4], const GPoint texs[4], int level, const GPaint& paint)
    {
       
        float e_x = (verts[0].x - verts[1].x + verts[2].x - verts[3].x) * 0.5f; //E = (A+C)/2 - (B+D)/2 = (A - B + C - D) / 2
        float e_y = (verts[0].y - verts[1].y + verts[2].y - verts[3].y) * 0.5f; //E = (A+C)/2 - (B+D)/2 = (A - B + C - D) / 2
        GPoint e = GPoint{e_x, e_y};
        GPoint e_prime = e * 0.25f;
  

        GPoint** new_quads = new GPoint*[level+2];
        GColor** new_colors = new GColor*[level+2];
        GPoint** new_texs = new GPoint*[level+2];



        for(int i = 0; i < level + 2; i++){
            float u = float(i) / (1 + level);

            new_quads[i] = new GPoint[level + 2];
            new_colors[i] = new GColor[level + 2];
            new_texs[i] = new GPoint[level + 2];
            for(int j = 0; j < level + 2; j ++){
                float v = float(j) / (1 + level);
                GPoint p = (1-u)*(1-v)* verts[0] + u * (1-v) * verts[1] + u * v * verts[2] + (1-u) * v * verts[3];

                
                new_quads[i][j] = p;

                if(colors != nullptr){
                    GColor c = (1-u)*(1-v)* colors[0] + u * (1-v) * colors[1] + u * v * colors[2] + (1-u) * v * colors[3];
                    
                   

                    new_colors[i][j] = c;
                }

                if(texs != nullptr){
                    GPoint t = (1-u)*(1-v)* texs[0] + u * (1-v) * texs[1] + u * v * texs[2] + (1-u) * v * texs[3];
                    
                    new_texs[i][j] = t;
                }
            }
        }

        for(int i = 0; i < level + 1; i++){
            for(int j = 0; j < level + 1; j++){
                GPoint mesh_verts[6] = {new_quads[i][j], new_quads[i+1][j], new_quads[i][j+1], new_quads[i+1][j], new_quads[i+1][j+1], new_quads[i][j+1]};

                GColor mesh_colors[6];
                if(colors != nullptr){
                    mesh_colors[0] = new_colors[i][j];
                    mesh_colors[1] = new_colors[i+1][j];
                    mesh_colors[2] = new_colors[i][j+1];
                    mesh_colors[3] =  new_colors[i+1][j];
                    mesh_colors[4] = new_colors[i+1][j+1];
                    mesh_colors[5] =  new_colors[i][j+1];
                }
                GPoint mesh_texs[6];
                if(texs != nullptr){
                    mesh_texs[0] = new_texs[i][j];
                    mesh_texs[1] = new_texs[i+1][j];
                    mesh_texs[2] = new_texs[i][j+1];
                    mesh_texs[3] = new_texs[i+1][j];
                    mesh_texs[4] = new_texs[i+1][j+1];
                    mesh_texs[5] = new_texs[i][j+1];
                }
                int indices[] = {0, 1, 2, 3, 4, 5};

                if(colors == nullptr){
                    drawMesh(mesh_verts, nullptr, mesh_texs, 2, indices, paint);
                }

                else if(texs == nullptr){
                    drawMesh(mesh_verts, mesh_colors, nullptr, 2, indices, paint);
                }
                else{
                    drawMesh(mesh_verts, mesh_colors, mesh_texs, 2, indices, paint);
                }
                
            }
        }
    }
        


    

std::string GDrawSomething(GCanvas* canvas, GISize dim) {
    // as fancy as you like
    // ...
    // canvas->clear(...);
    // canvas->fillRect(...);

    // SQUARE USING GPATH addLine()
    // GPath path;

    // auto draw_color_path = [&](float x, float y, GColor c) {
    //     GPaint paint(c);
    //     canvas->save();
    //     canvas->translate(x, y);
    //     canvas->drawPath(path, paint);
    //     canvas->restore();
    // };

    // path = GPath();
    // path.addLine({10, 10}, {50, 10}, 10, GPath::kCCW_Direction);
    // path.addLine({50, 10}, {50, 50}, 10, GPath::kCCW_Direction);
    // path.addLine({50, 50}, {10, 50}, 10, GPath::kCCW_Direction);
    // path.addLine({10, 50}, {10, 10}, 10, GPath::kCCW_Direction);
    
    // draw_color_path(0, 0, {1, 1, 1, 1});

    // void draw_bitmap(GCanvas* canvas, const GRect& r, const GBitmap& bm, GBlendMode mode) {
    //     GPaint paint;
    //     paint.setBlendMode(mode);
        
    //     GMatrix m = GMatrix::Translate(r.left, r.top)
    //             * GMatrix::Scale(r.width() / bm.width(), r.height() / bm.height());

    //     auto sh = make_bm_shader(bm, m);
    //     paint.setShader(sh.get());
    //     canvas->drawRect(r, paint);
    // }

    // BILERP COLORS TEST
    // GBitmap bm0;
    // bm0.readFromFile("apps/spock.png");
    // const GRect r = GRect::WH(300, 300);
    // // draw_bitmap(canvas, r, bm0, GBlendMode::kSrc);
    // GPaint paint;
    // paint.setBlendMode(GBlendMode::kSrc);
        
    // GMatrix m = GMatrix::Translate(r.left, r.top)
    //         * GMatrix::Scale(r.width() / bm0.width(), r.height() / bm0.height());

    // auto sh = GCreateBitmapShader(bm0, m, GTileMode::kMirror);
    // paint.setShader(sh.get());
    // canvas->drawRect(r, paint);

    // const GMatrix m = GMatrix::Rotate(gFloatPI/6) * GMatrix::Scale(0.4f, 0.4f);
    // GBitmap bm;
    // bm.readFromFile("apps/spock.png");
    // auto sh = GCreateBitmapShader(bm, m, GTileMode::kRepeat);
    // canvas->drawRect(GRect::XYWH(0, 0, 512, 250), GPaint(sh.get()));
    // sh = GCreateBitmapShader(bm, m, GTileMode::kMirror);
    // canvas->drawRect(GRect::XYWH(0, 262, 512, 250), GPaint(sh.get()));

    // RADIAL GRADIENT TEST

    // canvas->scale(2, 2);

    // const GPoint center = {128, 128};

    // float radius = 70;

    // const GColor clr[] = {
    //     { 1, 0, 0, 1 }, { 0, 1, 0, 1 }, { 0, 0, 1, 1 }, 
    // };

    // auto sh = GCreateRadialGradientShader(center, radius, clr, 3, GTileMode::kClamp);

    // GPaint paint(sh.get());
    // canvas->drawRect({0, 0, 256, 256}, paint);

    // const GMatrix m = GMatrix::Rotate(gFloatPI/6) * GMatrix::Scale(0.2f, 0.2f);
    // GBitmap bm;
    // bm.readFromFile("apps/spock.png");
    // auto sh = GCreateBilerpBitmapShader(bm, m, GTileMode::kRepeat);
    // canvas->drawRect(GRect::XYWH(0, 0, 256, 125), GPaint(sh.get()));
    // sh = GCreateBilerpBitmapShader(bm, m, GTileMode::kMirror);
    // canvas->drawRect(GRect::XYWH(0, 131, 256, 125), GPaint(sh.get()));
   

//     //COONS TEST
//     // create the bitmap
// //   GBitmap bm;
//   GPoint src[12] = {
//     {50, 50},
//       {100, 70}, {150, 60},
//     {200, 30},
//       {190, 100}, {210, 150},
//     {240, 200},
//       {160, 210}, {100, 220},
//     {10, 200},
//       {40, 170}, {60, 110}};
  
// //   GColor colors[4] = {
// //       GColor::RGBA(1, .2, 0, 1),
// //       GColor::RGBA(0, .5, .9, 1),
// //       GColor::RGBA(.5, 0, .7, 1),
// //       GColor::RGBA(0, .7, .6, 1)
// //     };
// //   canvas->drawCubicQuad(src, colors, nullptr, 12, GPaint());

//   //COONS TWO

//   GBitmap bitmap;
//   bitmap.readFromFile("apps/spock.png");
//   const float w = bitmap.width();
//   const float h = bitmap.height();

//   auto shader = GCreateBitmapShader(bitmap, GMatrix(), GTileMode::kClamp);

//   const GPoint texs[4] = {
//     {0, 0}, {w, 0}, {w, h}, {0, h},
//   };

// //   const GPoint texs[4] = {
// //             {w, 0}, {2*w, 0}, {2*w, h}, {w, h},
// //   };

//   canvas->drawCubicQuad(src, nullptr, texs, 4, GPaint(shader.get()));

 
//   // GPoint quadPts[4] = { src[0], src[3], src[6], src[9] };
//   // canvas->drawQuad(quadPts, colors, nullptr, 12, GPaint());
  
    return "tears in rain";
}

