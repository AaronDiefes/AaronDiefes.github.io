#include "include/GPath.h"
#include <cmath>
#include <iostream>

GPoint get_quad_bezier(const GPoint* curr_points, float t){
    GPoint tangent;

    tangent.x = curr_points[0].x * pow(1-t, 2) + 2 * curr_points[1].x * t * (1-t) + curr_points[2].x * t * t;
    tangent.y = curr_points[0].y * pow(1-t, 2) + 2 * curr_points[1].y * t * (1-t) + curr_points[2].y * t * t;
    
    return tangent;
}

GPoint get_cubic_bezier(const GPoint* curr_points, float t){
    GPoint tangent;

    tangent.x = curr_points[0].x * pow(1-t, 3) + 3 * curr_points[1].x * t * pow(1-t, 2) + 3 * curr_points[2].x * (1-t) * t * t + curr_points[3].x * pow(t, 3);
    tangent.y = curr_points[0].y * pow(1-t, 3) + 3 * curr_points[1].y * t * pow(1-t, 2) + 3 * curr_points[2].y * (1-t) * t * t + curr_points[3].y * pow(t, 3);

    return tangent;
}

//acts on a GPath
//GPath has rectangle, what are bounds and orientation
//iterate over points
//this->moveTo
void GPath::addRect(const GRect& r, GPath::Direction dir) {
    this->moveTo(r.left, r.top);
    if(dir == kCW_Direction){
        this->lineTo(r.right, r.top);
        this->lineTo(r.right, r.bottom);
        this->lineTo(r.left, r.bottom);
        this->lineTo(r.left, r.top);
    }
    else{
        this->lineTo(r.left, r.bottom);
        this->lineTo(r.right, r.bottom);
        this->lineTo(r.right, r.top);
        this->lineTo(r.left, r.top);
    }
    return;
};
void GPath::addPolygon(const GPoint pts[], int count){
    this->moveTo(pts[0]);
    for(int i = 1; i < count; i++){
        this->lineTo(pts[i]);
    }
    return;
};
GRect GPath::bounds() const{
    if(fPts.size() == 0){
        return GRect{0, 0, 0, 0};
    }
    
    float minX = fPts[0].x;
    float minY = fPts[0].y;
    float maxX = fPts[0].x;
    float maxY = fPts[0].y;
    
    // float minX = 0.0f;
    // float minY = 0.0f;
    // float maxX = 1000.0f;
    // float maxY = 1000.0f;

    float t_x;
    float t_y;
    GPoint tangent;
    GPoint curr_points[4];
    GPath::Edger iter(*this);
    std::vector<float> candidate_x;
    std::vector<float> candidate_y;


    while(auto v = iter.next(curr_points)) {
        switch(v.value()){
            case GPath::kMove:
                candidate_x.push_back(curr_points[0].x);
                candidate_y.push_back(curr_points[0].y);
                break;
            case GPath::kLine:
                candidate_x.push_back(curr_points[0].x);
                candidate_y.push_back(curr_points[0].y);
                
                candidate_x.push_back(curr_points[1].x);
                candidate_y.push_back(curr_points[1].y);   
                break;
            
            case GPath::kQuad:
                candidate_x.push_back(curr_points[0].x);
                candidate_y.push_back(curr_points[0].y);
                
                candidate_x.push_back(curr_points[2].x);
                candidate_y.push_back(curr_points[2].y);

                //t = (A - B) / (A - 2B + C)
                t_x = (curr_points[0].x - curr_points[1].x) / (curr_points[0].x - 2 * curr_points[1].x + curr_points[2].x);
                t_y = (curr_points[0].y - curr_points[1].y) / (curr_points[0].y - 2 * curr_points[1].y + curr_points[2].y);
                
                if(t_x >= 0.0f && t_x <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_quad_bezier(curr_points, t_x);
                    candidate_x.push_back(tangent.x); 
                }

                if(t_y >= 0.0f && t_y <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_quad_bezier(curr_points, t_y);
                    candidate_y.push_back(tangent.y); 
                }

                break;

            case GPath::kCubic:

                float t_1_x;
                float t_1_y;
                float t_2_x;
                float t_2_y;

                candidate_x.push_back(curr_points[0].x);
                candidate_y.push_back(curr_points[0].y);
                
                candidate_x.push_back(curr_points[3].x);
                candidate_y.push_back(curr_points[3].y);


                float a_x = (-3.0f * curr_points[0].x) + (9.0f * curr_points[1].x) - (9.0f * curr_points[2].x) + (3.0f * curr_points[3].x);
                float a_y = (-3.0f * curr_points[0].y) + (9.0f * curr_points[1].y) - (9.0f * curr_points[2].y) + (3.0f * curr_points[3].y);

                a_x += 0.01f;
                a_y += 0.01f;
                
                float b_x = (6.0f * curr_points[0].x) - (12.0f * curr_points[1].x) + (6.0f * curr_points[2].x);
                float b_y = (6.0f * curr_points[0].y) - (12.0f * curr_points[1].y) + (6.0f * curr_points[2].y);

                float c_x = (3.0f * curr_points[1].x) - (3.0f * curr_points[0].x);
                float c_y = (3.0f * curr_points[1].y) - (3.0f * curr_points[0].y);
                
                //t1
                if(sqrt(b_x * b_x - (4.0f * a_x * c_x)) >= 0.0f){
                    
                    t_1_x =(-b_x + sqrt(b_x * b_x - (4.0f * a_x * c_x))) / (2.0f * a_x);
                    
                }

                if(sqrt(b_y * b_y - (4.0f * a_y * c_y)) >= 0.0f){
                    
                    t_1_y = (-b_y + sqrt(b_y * b_y - (4.0f * a_y * c_y))) / (2.0f * a_y);
                    // std::cout<<t_1_y<<std::endl;
                }

                //t2
                if(sqrt(b_x * b_x - (4.0f * a_x * c_x)) >= 0.0f){
                    t_2_x = (-b_x - sqrt(b_x * b_x - (4.0f * a_x * c_x))) / (2.0f * a_x);
                }

                if(sqrt(b_y * b_y - (4.0f * a_y * c_y)) >= 0.0f){
                    t_2_y = (-b_y - sqrt(b_y * b_y - (4.0f * a_y * c_y))) / (2.0f * a_y);
                }
                
  
                if(t_1_x >= 0.0f && t_1_x <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_cubic_bezier(curr_points, t_1_x);
                    // std::cout<<tangent.x<<std::endl;
                    candidate_x.push_back(tangent.x);
                }

                 if(t_1_y >= 0.0f && t_1_y <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_cubic_bezier(curr_points, t_1_y);
                    candidate_y.push_back(tangent.y);
                }

                 if(t_2_x >= 0.0f && t_2_x <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_cubic_bezier(curr_points, t_2_x);
                    candidate_x.push_back(tangent.x);
                }

                 if(t_2_y >= 0.0f && t_2_y <= 1.0f){
                    // std::cout<<"computing tight bounds"<<std::endl;
                    tangent = get_cubic_bezier(curr_points, t_2_y);
                    candidate_y.push_back(tangent.y);
                }
                break;
            
            // default:
            //     break;
            
        }
    }

    for(int i = 0; i < candidate_x.size(); i++){
        // std::cout<<candidate_x[i]<<std::endl;
        if(minX > candidate_x[i]){
            minX = candidate_x[i];
        }
        if(maxX < candidate_x[i]){
            maxX = candidate_x[i];
        }
    }

    for(int i = 0; i < candidate_y.size(); i++){
        if(minY > candidate_y[i]){
            minY = candidate_y[i];
        }
        if(maxY < candidate_y[i]){
            maxY = candidate_y[i];
        }
    }
    // std::cout<<"l "<<minX<<" t "<<minY<<" r "<<maxX<<" b "<<maxY<<std::endl;
    return GRect{minX, minY, maxX, maxY};
};


void GPath::transform(const GMatrix& m){
   m.mapPoints(fPts.data(), fPts.data(), fPts.size());
   return;
};

// void GPath::addLine(GPoint p1, GPoint p2, float width, GPath::Direction dir){
//     GPoint corner_points[4];
//     if(p1.y > p2.y){
//         GPoint tp1 = p1;
//         GPoint tp2 = p2;
//         p2 = tp1;
//         p1 = tp2;
//     }

//     float slope = (p2.x - p1.x) / (p2.y - p1.y);
//     float perp_slope = -1.0f / slope;
//     float move_num = perp_slope * width;
    
//     corner_points[0] = GPoint{p1.x + width / 2.0f, p1.y - width / 2.0f};
//     corner_points[1] = GPoint{p2.x + width / 2.0f, p2.y - width / 2.0f};
//     corner_points[2] = GPoint{p2.x - width / 2.0f, p2.y + width / 2.0f};
//     corner_points[3] = GPoint{p1.x - width / 2.0f, p1.y + width / 2.0f};

//     this->moveTo(corner_points[0]);
//     if(dir == kCCW_Direction){
//         this->lineTo(corner_points[1]);
//         this->lineTo(corner_points[2]);
//         this->lineTo(corner_points[3]);
//         this->lineTo(corner_points[0]);
//     }
//     else{
//         this->lineTo(corner_points[3]);
//         this->lineTo(corner_points[2]);
//         this->lineTo(corner_points[1]);
//         this->lineTo(corner_points[0]);
//     }
//     return;
// }

void GPath::addCircle(GPoint center, float radius, GPath::Direction dir){    
    
    GMatrix mx = GMatrix{radius, 0, center.x, 0, radius, center.y};

    GPoint unit_points[16];
    unit_points[0] = GPoint{0.0f, 1.0f};
    unit_points[1] = GPoint{0.41421356237f, 1.0f};
    unit_points[2] = GPoint{1.0f/sqrtf(2), 1.0f/sqrtf(2)};
    unit_points[3] = GPoint{1.0f, 0.41421356237f};

    unit_points[4] = GPoint{1.0f, 0.0f};
    unit_points[5] = GPoint{1.0f, -0.41421356237f};
    unit_points[6] = GPoint{1.0f/sqrtf(2), -1.0f/sqrtf(2)};
    unit_points[7] = GPoint{0.41421356237f, -1.0f};

    unit_points[8] = GPoint{0.0f, -1.0f};
    unit_points[9] = GPoint{-0.41421356237f, -1.0f};
    unit_points[10] = GPoint{-1.0f/sqrtf(2), -1.0f/sqrtf(2)};
    unit_points[11] = GPoint{-1.0f, -0.41421356237f};

    unit_points[12] = GPoint{-1.0f, 0.0f};
    unit_points[13] = GPoint{-1.0f, 0.41421356237f};
    unit_points[14] = GPoint{-1.0f/sqrtf(2), 1.0f/sqrtf(2)};;
    unit_points[15] = GPoint{-0.41421356237f, 1.0f};

    for(int i = 0; i < 16; i++){
        unit_points[i] = mx * unit_points[i];
    }
    
    this->moveTo(unit_points[0]);

    if(dir == kCCW_Direction){
        // std::cout<<"clockwise"<<std::endl;
        this->quadTo(unit_points[1], unit_points[2]);
        this->quadTo(unit_points[3], unit_points[4]);
        this->quadTo(unit_points[5], unit_points[6]);
        this->quadTo(unit_points[7], unit_points[8]);
        this->quadTo(unit_points[9], unit_points[10]);
        this->quadTo(unit_points[11], unit_points[12]);
        this->quadTo(unit_points[13], unit_points[14]);
        this->quadTo(unit_points[15], unit_points[0]);
    }
    else{
        // std::cout<<"counter-clockwise"<<std::endl;
        this->quadTo(unit_points[15], unit_points[14]);
        this->quadTo(unit_points[13], unit_points[12]);
        this->quadTo(unit_points[11], unit_points[10]);
        this->quadTo(unit_points[9], unit_points[8]);
        this->quadTo(unit_points[7], unit_points[6]);
        this->quadTo(unit_points[5], unit_points[4]);
        this->quadTo(unit_points[3], unit_points[2]);
        this->quadTo(unit_points[1], unit_points[0]);
    }
    
    return;
}


void GPath::ChopQuadAt(const GPoint src[3], GPoint dst[5], float t){

    // Bezier control points
    GPoint A = src[0];
    GPoint B = src[1];
    GPoint C = src[2];

    // GPoint tangent_A = 2 * (1 - t) * (B - A);
    // GPoint tangent_B = 2 * t * (C - B);

    
    GPoint Q = A + (B - A) * t;
    GPoint R = B + (C - B) * t;
    GPoint S = Q + (R - Q) * t;

    dst[0] = A;
    dst[1] = Q;
    dst[2] = S;
    dst[3] = R;
    dst[4] = C;
                                             
    return;
}

void GPath::ChopCubicAt(const GPoint src[4], GPoint dst[7], float t){
    // Bezier control points
    GPoint A = src[0];
    GPoint B = src[1];
    GPoint C = src[2];
    GPoint D = src[3];

    //first intermediates
    GPoint E = B*t + (1-t) * A;
    GPoint F = C*t + (1-t) * B;
    GPoint G = D*t + (1-t) * C;

    //second intermediate
    GPoint H = F*t + (1-t) * E;
    GPoint I = G*t + (1-t) * F;
   

    //third intermediate
    GPoint J = I*t + (1-t) * H;

    dst[0] = A;
    dst[1] = E;
    dst[2] = H;
    dst[3] = J;
    dst[4] = I;  
    dst[5] = G;  
    dst[6] = D; 

    return;
}
