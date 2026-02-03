#ifndef SHADER_H
#define SHADER_H
#include "include/GShader.h"
#include "include/GPaint.h"
#include "include/GPixel.h"
#include "include/GBitmap.h" 
#include "include/GMatrix.h"
#include "include/GPoint.h"
#include "Edge.h"
#include <iostream>
#include "blend_functions.h"
#include "include/GColor.h"
#include "my_utils.h"
#include <math.h>

class MyBMShader:public GShader{
  public: 
    MyBMShader(const GBitmap& device, const GMatrix& mat, GTileMode TileMode) {
      fDevice = device;
      fMat = mat;
      tile_mode = TileMode;
    }
    // ~MyBMShader(){}

    bool isOpaque() override{
        return fDevice.isOpaque();
    }
    
    bool setContext(const GMatrix& ctm) override{
        GMatrix temp = ctm * fMat;

        if(auto inverted = temp.invert()){
          inv = *inverted;
          return true;
        }
        inv = fMat;
        return false;
    }

    void shadeRow(int x, int y, int count, GPixel row[]) override{
      float x_prime = inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]; //x' = ax + cy + e
      float y_prime = inv[1] * (x + 0.5f) + inv[3] * (y + 0.5f) + inv[5]; //y' = bx + dy + f
      
      if(tile_mode == GTileMode::kRepeat){
        for(int i = 0; i < count; i++){
          int xCurr = GFloorToInt(x_prime);
          int yCurr = GFloorToInt(y_prime);


          xCurr = repeatX(fDevice, xCurr);
          yCurr = repeatY(fDevice, yCurr);
 
         
          row[i] = *(fDevice.getAddr(xCurr, yCurr));
          x_prime += inv[0];
          y_prime += inv[1];
        }
      }

      else if(tile_mode == GTileMode::kMirror){

        for(int i = 0; i < count; i++){
          int xCurr = GFloorToInt(x_prime);
          int yCurr = GFloorToInt(y_prime);


          xCurr = mirrorX(fDevice, xCurr);
          yCurr = mirrorY(fDevice, yCurr);
 
         
          row[i] = *(fDevice.getAddr(xCurr, yCurr));
          x_prime += inv[0];
          y_prime += inv[1];
        }
      }


      else{
          for(int i = 0; i < count; i++){

            int xCurr = GFloorToInt(x_prime);
            int yCurr = GFloorToInt(y_prime);
            xCurr = clamp_x(xCurr);
            yCurr = clamp_y(yCurr);


            row[i] = *(fDevice.getAddr(xCurr, yCurr));
            
            x_prime += inv[0];
            y_prime += inv[1];
          }
        }
      }                
  

    int clamp_x(int x){
      if(x <= 0){
        return 0;
      }
      if(x >= fDevice.width()){
        return fDevice.width() - 1;
      }
      return x;
    }

    int clamp_y(int y){
      if(y <= 0){
        return 0;
      }
      if(y >= fDevice.height()){
        return fDevice.height() - 1;
      }
      return y;
    }

    int mirrorX(const GBitmap& bm, float x) {
      x = x < 0.0f ? -x : x;
      int map = GRoundToInt(x) % (bm.width() * 2);
      if (map >= bm.width()) return (bm.width() * 2) - map - 1;
      return map;
    }

 

    int mirrorY(const GBitmap& bm, float y) {
      y = y < 0.0f ? -y : y;
      int map = GRoundToInt(y) % (bm.height() * 2);
      if (map >= bm.height()) return (bm.height() * 2) - map - 1;
      return map;
    }

    int repeatX(const GBitmap& bm, float x) {

      int res;
      if (x < 0.0f) {
        res = bm.width() - (GRoundToInt(abs(x)) % bm.width());
      } else {
        res = GRoundToInt(x) % bm.width();
      }
      if (res == bm.width()) return bm.width() - 1;
      return res;
    }

    

    int repeatY(const GBitmap& bm, float y) {
      int res;
      if (y < 0.0f) {
        res = bm.height() - (GRoundToInt(abs(y)) % bm.height());
      } else {
        res = GRoundToInt(y) % bm.height();
      }
      if (res == bm.height()) return bm.height() - 1;
      return res;
    }


  private:
    GBitmap fDevice;
    GMatrix fMat;
    GMatrix inv;
    GTileMode tile_mode;
};

class MyBilerpBMShader:public GShader{
  public: 
    MyBilerpBMShader(const GBitmap& device, const GMatrix& mat, GTileMode TileMode) {
      fDevice = device;
      fMat = mat;
      tile_mode = TileMode;
    }
    // ~MyBMShader(){}

    bool isOpaque() override{
        return fDevice.isOpaque();
    }
    
    bool setContext(const GMatrix& ctm) override{
        GMatrix temp = ctm * fMat;

        if(auto inverted = temp.invert()){
          inv = *inverted;
          return true;
        }
        inv = fMat;
        return false;
    }

    void shadeRow(int x, int y, int count, GPixel row[]) override{
      float x_prime = inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]; //x' = ax + cy + e
      float y_prime = inv[1] * (x + 0.5f) + inv[3] * (y + 0.5f) + inv[5]; //y' = bx + dy + f
      
      if(tile_mode == GTileMode::kRepeat){
       
        for(int i = 0; i < count; i++){
          int xCurr = GFloorToInt(x_prime);
          int yCurr = GFloorToInt(y_prime);

            float u = x_prime - GFloorToInt(x_prime);
            float v = y_prime - GFloorToInt(y_prime);

            GPoint top = {repeatX(fDevice, xCurr), repeatY(fDevice, yCurr - 0.5f)};
            GPoint right = {repeatX(fDevice, xCurr + 0.5f), repeatY(fDevice, yCurr)};
            GPoint bottom = {repeatX(fDevice, xCurr), repeatY(fDevice, yCurr + 0.5f)};
            GPoint left = {repeatX(fDevice, xCurr - 0.5f), repeatY(fDevice, yCurr)};

            GPixel topP = *(fDevice.getAddr(GFloorToInt(top.x), GFloorToInt(top.y)));
            GPixel rightP = *(fDevice.getAddr(GFloorToInt(right.x), GFloorToInt(right.y)));
            GPixel bottomP = *(fDevice.getAddr(GFloorToInt(bottom.x), GFloorToInt(bottom.y)));
            GPixel leftP = *(fDevice.getAddr(GFloorToInt(left.x), GFloorToInt(left.y)));

            unsigned topA = GPixel_GetA(topP);
            unsigned topR = GPixel_GetR(topP);
            unsigned topG = GPixel_GetG(topP);
            unsigned topB = GPixel_GetB(topP);

            unsigned rightA = GPixel_GetA(rightP);
            unsigned rightR = GPixel_GetR(rightP);
            unsigned rightG = GPixel_GetG(rightP);
            unsigned rightB = GPixel_GetB(rightP);

            unsigned bottomA = GPixel_GetA(bottomP);
            unsigned bottomR = GPixel_GetR(bottomP);
            unsigned bottomG = GPixel_GetG(bottomP);
            unsigned bottomB = GPixel_GetB(bottomP);

            unsigned leftA = GPixel_GetA(leftP);
            unsigned leftR = GPixel_GetR(leftP);
            unsigned leftG = GPixel_GetG(leftP);
            unsigned leftB = GPixel_GetB(leftP);

            unsigned resultA = (1 - u) * (1 - v) * topA + u * (1 - v) * rightA + u * v * bottomA + (1 - u) * v * leftA;
            unsigned resultR = (1 - u) * (1 - v) * topR + u * (1 - v) * rightR + u * v * bottomR + (1 - u) * v * leftR;
            unsigned resultG = (1 - u) * (1 - v) * topG + u * (1 - v) * rightG + u * v * bottomG + (1 - u) * v * leftG;
            unsigned resultB = (1 - u) * (1 - v) * topB + u * (1 - v) * rightB + u * v * bottomB + (1 - u) * v * leftB;

            GPixel result = GPixel_PackARGB(resultA, resultR, resultG, resultB);
            
            row[i] = result;

            x_prime += inv[0];
            y_prime += inv[1];
          }
        
        }

      else if(tile_mode == GTileMode::kMirror){

        for(int i = 0; i < count; i++){
          int xCurr = GFloorToInt(x_prime);
          int yCurr = GFloorToInt(y_prime);

          float u = x_prime - GFloorToInt(x_prime);
          float v = y_prime - GFloorToInt(y_prime);

            GPoint top = {mirrorX(fDevice, xCurr), mirrorY(fDevice, yCurr - 0.5f)};
            GPoint right = {mirrorX(fDevice, xCurr + 0.5f), mirrorY(fDevice, yCurr)};
            GPoint bottom = {mirrorX(fDevice, xCurr), mirrorY(fDevice, yCurr + 0.5f)};
            GPoint left = {mirrorX(fDevice, xCurr - 0.5f), mirrorY(fDevice, yCurr)};

            GPixel topP = *(fDevice.getAddr(GFloorToInt(top.x), GFloorToInt(top.y)));
            GPixel rightP = *(fDevice.getAddr(GFloorToInt(right.x), GFloorToInt(right.y)));
            GPixel bottomP = *(fDevice.getAddr(GFloorToInt(bottom.x), GFloorToInt(bottom.y)));
            GPixel leftP = *(fDevice.getAddr(GFloorToInt(left.x), GFloorToInt(left.y)));

            unsigned topA = GPixel_GetA(topP);
            unsigned topR = GPixel_GetR(topP);
            unsigned topG = GPixel_GetG(topP);
            unsigned topB = GPixel_GetB(topP);

            unsigned rightA = GPixel_GetA(rightP);
            unsigned rightR = GPixel_GetR(rightP);
            unsigned rightG = GPixel_GetG(rightP);
            unsigned rightB = GPixel_GetB(rightP);

            unsigned bottomA = GPixel_GetA(bottomP);
            unsigned bottomR = GPixel_GetR(bottomP);
            unsigned bottomG = GPixel_GetG(bottomP);
            unsigned bottomB = GPixel_GetB(bottomP);

            unsigned leftA = GPixel_GetA(leftP);
            unsigned leftR = GPixel_GetR(leftP);
            unsigned leftG = GPixel_GetG(leftP);
            unsigned leftB = GPixel_GetB(leftP);

            unsigned resultA = (1 - u) * (1 - v) * topA + u * (1 - v) * rightA + u * v * bottomA + (1 - u) * v * leftA;
            unsigned resultR = (1 - u) * (1 - v) * topR + u * (1 - v) * rightR + u * v * bottomR + (1 - u) * v * leftR;
            unsigned resultG = (1 - u) * (1 - v) * topG + u * (1 - v) * rightG + u * v * bottomG + (1 - u) * v * leftG;
            unsigned resultB = (1 - u) * (1 - v) * topB + u * (1 - v) * rightB + u * v * bottomB + (1 - u) * v * leftB;

            GPixel result = GPixel_PackARGB(resultA, resultR, resultG, resultB);
            
            row[i] = result;

            x_prime += inv[0];
            y_prime += inv[1];

        }
      }


      else{
          for(int i = 0; i < count; i++){

            int xCurr = GFloorToInt(x_prime);
            int yCurr = GFloorToInt(y_prime);

            float u = x_prime - GFloorToInt(x_prime);
            float v = y_prime - GFloorToInt(y_prime);

            GPoint top = {clamp_x(xCurr), clamp_y(yCurr - 0.5f)};
            GPoint right = {clamp_x(xCurr + 0.5f), clamp_y(yCurr)};
            GPoint bottom = {clamp_x(xCurr), clamp_y(yCurr + 0.5f)};
            GPoint left = {clamp_x(xCurr - 0.5f), clamp_y(yCurr)};

            GPixel topP = *(fDevice.getAddr(GFloorToInt(top.x), GFloorToInt(top.y)));
            GPixel rightP = *(fDevice.getAddr(GFloorToInt(right.x), GFloorToInt(right.y)));
            GPixel bottomP = *(fDevice.getAddr(GFloorToInt(bottom.x), GFloorToInt(bottom.y)));
            GPixel leftP = *(fDevice.getAddr(GFloorToInt(left.x), GFloorToInt(left.y)));

            unsigned topA = GPixel_GetA(topP);
            unsigned topR = GPixel_GetR(topP);
            unsigned topG = GPixel_GetG(topP);
            unsigned topB = GPixel_GetB(topP);

            unsigned rightA = GPixel_GetA(rightP);
            unsigned rightR = GPixel_GetR(rightP);
            unsigned rightG = GPixel_GetG(rightP);
            unsigned rightB = GPixel_GetB(rightP);

            unsigned bottomA = GPixel_GetA(bottomP);
            unsigned bottomR = GPixel_GetR(bottomP);
            unsigned bottomG = GPixel_GetG(bottomP);
            unsigned bottomB = GPixel_GetB(bottomP);

            unsigned leftA = GPixel_GetA(leftP);
            unsigned leftR = GPixel_GetR(leftP);
            unsigned leftG = GPixel_GetG(leftP);
            unsigned leftB = GPixel_GetB(leftP);

            unsigned resultA = (1 - u) * (1 - v) * topA + u * (1 - v) * rightA + u * v * bottomA + (1 - u) * v * leftA;
            unsigned resultR = (1 - u) * (1 - v) * topR + u * (1 - v) * rightR + u * v * bottomR + (1 - u) * v * leftR;
            unsigned resultG = (1 - u) * (1 - v) * topG + u * (1 - v) * rightG + u * v * bottomG + (1 - u) * v * leftG;
            unsigned resultB = (1 - u) * (1 - v) * topB + u * (1 - v) * rightB + u * v * bottomB + (1 - u) * v * leftB;

            GPixel result = GPixel_PackARGB(resultA, resultR, resultG, resultB);
            
            row[i] = result;

            x_prime += inv[0];
            y_prime += inv[1];

          }
        }
      }
                    
  

    int clamp_x(int x){
      if(x <= 0){
        return 0;
      }
      if(x >= fDevice.width()){
        return fDevice.width() - 1;
      }
      return x;
    }

    int clamp_y(int y){
      if(y <= 0){
        return 0;
      }
      if(y >= fDevice.height()){
        return fDevice.height() - 1;
      }
      return y;
    }

    int mirrorX(const GBitmap& bm, float x) {
      x = x < 0.0f ? -x : x;
      int map = GRoundToInt(x) % (bm.width() * 2);
      if (map >= bm.width()) return (bm.width() * 2) - map - 1;
      return map;
    }

 

    int mirrorY(const GBitmap& bm, float y) {
      y = y < 0.0f ? -y : y;
      int map = GRoundToInt(y) % (bm.height() * 2);
      if (map >= bm.height()) return (bm.height() * 2) - map - 1;
      return map;
    }

    int repeatX(const GBitmap& bm, float x) {

      int res;
      if (x < 0.0f) {
        res = bm.width() - (GRoundToInt(abs(x)) % bm.width());
      } else {
        res = GRoundToInt(x) % bm.width();
      }
      if (res == bm.width()) return bm.width() - 1;
      return res;
    }

    

    int repeatY(const GBitmap& bm, float y) {
      int res;
      if (y < 0.0f) {
        res = bm.height() - (GRoundToInt(abs(y)) % bm.height());
      } else {
        res = GRoundToInt(y) % bm.height();
      }
      if (res == bm.height()) return bm.height() - 1;
      return res;
    }


  private:
    GBitmap fDevice;
    GMatrix fMat;
    GMatrix inv;
    GTileMode tile_mode;
};


class MyGradientShader:public GShader{
  public:
    MyGradientShader(GPoint p0, GPoint p1, const GColor colors[], int count, GTileMode TileMode) : p0(p0), p1(p1), count(count) {
      for (int i = 0; i < count; i++){
        gradient_colors.push_back(colors[i]);
        // delta_colors.push_back(colors[i + 1] - colors[i]);
      }
      gradient_colors.push_back(colors[count - 1]);
      tile_mode = TileMode;
      // delta_colors.push_back(GColor{0, 0, 0, 0});
    }

    bool isOpaque() override{
      return false;
    }

    bool setContext(const GMatrix& ctm) override{
      GMatrix linear_transformation_matrix = GMatrix(
        p1.x - p0.x,    -(p1.y - p0.y),   p0.x,
        p1.y - p0.y,    p1.x - p0.x,      p0.y
      );
      
      GMatrix temp = ctm * linear_transformation_matrix;
      if(auto inverted = temp.invert()){
          inv = *inverted;
          return true;
      }
      return false;
    }

    void shadeRow(int x, int y, int c, GPixel row[]) override{

     
      float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]) * (count - 1); //x' = ax + cy + e

      if(tile_mode == GTileMode::kRepeat){
        for(int i = 0; i < c; i++){
          float currX = x_prime;
          currX = fmod(currX, count-1);
          
          int k = floor(currX);
          float t = currX - (float)k;
        
          GColor gradient_color = (1-t)*gradient_colors[k] + ((t) * gradient_colors[k + 1]);
          
          row[i] = unpremult(gradient_color);
          // row[i] = 0;

          x_prime += inv[0]*(count - 1);
        }  
      }
      else if(tile_mode == GTileMode::kMirror){
        for(int i = 0; i < c; i++){
          float currX = x_prime;

          currX = fmod(currX, 2*(count-1));
          
          if(currX > count-1){
            float tempX = currX;
            currX = 2*(count-1)-tempX;
          }

          int k = floor(currX);
          float t = currX - (float)k;
        
          GColor gradient_color = (1-t)*gradient_colors[k] + ((t) * gradient_colors[k + 1]);
          
          row[i] = unpremult(gradient_color);
          
          x_prime += inv[0]*(count - 1);

        }
      }
      else{

      
      for(int i = 0; i < c; i++){
        float currX = x_prime;
        if(currX < 0){
          currX = 0;
        }
        if(currX > count - 1){
          currX = count - 1;
        }
        int k = floor(currX);
        float t = currX - (float)k;
       
        GColor gradient_color = (1-t)*gradient_colors[k] + ((t) * gradient_colors[k + 1]);
        
        row[i] = unpremult(gradient_color);

        x_prime += inv[0]*(count - 1);
      }  
      }
    }

  
    

  private:
    GPoint p0;
    GPoint p1;
    int count;  
    std::vector<GColor> gradient_colors; 
    // std::vector<GColor> delta_colors;
    GMatrix inv;
    GTileMode tile_mode;
};

class TriColorShader:public GShader{
  public:
    TriColorShader(const GPoint p[3], const GColor c[3], int n) {
          this->points = new GPoint[3];
          this->colors = new GColor[3];
          for (int i = 0; i < 3; i++) {
              this->points[i] = p[i];
              this->colors[i] = c[i];
          }
          count = n;
    }

    bool isOpaque() override{
      return false;
    }

    bool setContext(const GMatrix& ctm) override{
      GMatrix P = {
        points[1].x - points[0].x,  points[2].x - points[0].x,  points[0].x,
        points[1].y - points[0].y,  points[2].y - points[0].y,  points[0].y,
      };
      GMatrix temp = ctm * P;
      if(auto inverted = temp.invert()){
          inv = *inverted;
          return true;
      }
      return false;
    }

    void shadeRow(int x, int y, int c, GPixel row[]) override{
      GColor DC1 = colors[1] - colors[0];
      GColor DC2 = colors[2] - colors[0];

      GColor DC = inv[0] * DC1 + inv[1] * DC2;
      GPoint curr_point = inv * GPoint{x + 0.5f, y + 0.5f};
      
      GColor new_color = curr_point.x * DC1 + curr_point.y * DC2 + colors[0];

      if(new_color.r <= 0){
        new_color.r = 0;
      }

      if(new_color.r >= 1.0f){
        new_color.r = 1.0f;
      }

      if(new_color.g <= 0){
        new_color.g = 0;
      }

      if(new_color.g >= 1.0f){
        new_color.g = 1.0f;
      }

      if(new_color.b <= 0){
        new_color.b = 0;
      }

      if(new_color.b >= 1.0f){
        new_color.b = 1.0f;
      }

      if(new_color.a <= 0){
        new_color.a = 0;
      }

      if(new_color.a >= 1.0f){
        new_color.a = 1.0f;
      }
      

      for(int i = 0; i < c; i++){
        row[i] = unpremult(new_color);
        // assert(GPixel_GetA(row[i]) <= 255);
        // assert(GPixel_GetR(row[i]) <= GPixel_GetA(row[i]));
        // assert(GPixel_GetG(row[i]) <= GPixel_GetA(row[i]));
        // assert(GPixel_GetB(row[i]) <= GPixel_GetA(row[i]));
            
        new_color += DC;
      }
    }

  private:
    GPoint* points;
    GColor* colors;
    GMatrix inv;
    int count; 
};



class ProxyShader : public GShader {
    GShader* fRealShader;
    GMatrix  fExtraTransform;
public:
    ProxyShader(GShader* shader, const GMatrix& extraTransform)
        : fRealShader(shader), fExtraTransform(extraTransform) {}

    bool isOpaque() override { return fRealShader->isOpaque(); }

    bool setContext(const GMatrix& ctm) override {
        return fRealShader->setContext(ctm * fExtraTransform);
    }
    
    void shadeRow(int x, int y, int count, GPixel row[]) override {
        fRealShader->shadeRow(x, y, count, row);
    }
};

class ComposeShader : public GShader {
  GShader* sh1;
  GShader* sh2;
public:
    GPixel modulate(GPixel p1, GPixel p2){
      int new_a =  GRoundToInt(div255(GPixel_GetA(p1) * GPixel_GetA(p2)));
      int new_r =  GRoundToInt(div255(GPixel_GetR(p1) * GPixel_GetR(p2)));
      int new_g =  GRoundToInt(div255(GPixel_GetG(p1) * GPixel_GetG(p2)));
      int new_b =  GRoundToInt(div255(GPixel_GetB(p1) * GPixel_GetB(p2)));
      
      return GPixel_PackARGB(new_a, new_r, new_g, new_b);
    }
    ComposeShader(GShader* shader1, GShader* shader2) : sh1(shader1), sh2(shader2){};

    bool isOpaque() override { return sh1->isOpaque() && sh2->isOpaque(); }

    bool setContext(const GMatrix& ctm) override {
        return sh1->setContext(ctm) && sh2->setContext(ctm);
    }
    
    void shadeRow(int x, int y, int c, GPixel row[]) override {
        GPixel row1[c];
        GPixel row2[c];

        sh1->shadeRow(x, y, c, row1);
        sh2->shadeRow(x, y, c, row2);

        for(int i = 0; i < c; i++){
          row[i] = modulate(row1[i], row2[i]);
        }

    }
};

class RadialGradientShader : public GShader {
  public:
    RadialGradientShader(const GPoint& center, float radius, const GColor colors[], int count, GTileMode tileMode)
        : center(center), radius(radius), count(count), tile_mode(tileMode) {
        for (int i = 0; i < count; i++) {
            gradient_colors.push_back(colors[i]);
        }
        gradient_colors.push_back(colors[count - 1]);
    }

    bool isOpaque() override {
        return false;
    }

    bool setContext(const GMatrix& ctm) override {
        
        // GMatrix radial_transformation_matrix = GMatrix(
        // cos(angle), -sin(angle), center.x(),
        // sin(angle), cos(angle), center.y()
        // );
        
        inv = ctm;
        if (auto inverted = inv.invert()) {
            inv = *inverted;
            return true;
        }
        return false;
    }

    void shadeRow(int x, int y, int c, GPixel row[]) override {
      float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]);
      float y_prime = (inv[1] * (x + 0.5f) + inv[3] * (y + 0.5f) + inv[5]);
      if(tile_mode == GTileMode::kClamp){
        for (int i = 0; i < c; i++) {
          float distance = sqrt(pow(x_prime - center.x, 2) + pow(y_prime - center.y, 2));
          if (distance < radius) {
            float t = distance / radius;
            int num_colors = count; 
            float color_index = t * (num_colors - 1); 
            int k = std::floor(color_index); 
            float t_blend = color_index - k; 
                
            GColor gradient_color;
            if (k < num_colors - 1) {
              GColor color0 = gradient_colors[k];
              GColor color1 = gradient_colors[k + 1];
              gradient_color = (1 - t_blend) * color0 + t_blend * color1;
            } 
            else {
                gradient_color = gradient_colors[num_colors - 1];
            }
            row[i] = unpremult(gradient_color);
          }
          else{
            row[i] = unpremult(gradient_colors[count - 1]);
          }
          x_prime += inv[0];
          y_prime += inv[1];
        }
  
      }
      else if (tile_mode == GTileMode::kMirror) {
        for (int i = 0; i < c; i++) {
          float distance = sqrt(pow(x_prime - center.x, 2) + pow(y_prime - center.y, 2));
          float t = distance / radius;
          t = fmod(t, 2.0f);
          if (t < 0){ 
              t += 2.0f;
          }
          if (t > 1.0f){
              t = 2.0f - t;
          }
          int num_colors = count; 
          float color_index = t * (num_colors - 1); 
          int k = std::floor(color_index); 
          float t_blend = color_index - k; 
              
          GColor gradient_color;
          if (k < num_colors - 1) {
            GColor color0 = gradient_colors[k];
            GColor color1 = gradient_colors[k + 1];
            gradient_color = (1 - t_blend) * color0 + t_blend * color1;
          } 
          else {
            assert(false);
            gradient_color = gradient_colors[num_colors - 1];
          }
          row[i] = unpremult(gradient_color);
         
          x_prime += inv[0];
          y_prime += inv[1];
        }
      }
    else{
      for (int i = 0; i < c; i++) {
        float distance = sqrt(pow(x_prime - center.x, 2) + pow(y_prime - center.y, 2));
        float t = distance / radius;

        // Ensure t is within [0, 1]
        t = fmod(t, 1.0f);
        if (t < 0){
            t += 1.0f;
        }

        int num_colors = count; 
          float color_index = t * (num_colors - 1); 
          int k = std::floor(color_index); 
          float t_blend = color_index - k; 
              
          GColor gradient_color;
          if (k < num_colors - 1) {
            GColor color0 = gradient_colors[k];
            GColor color1 = gradient_colors[k + 1];
            gradient_color = (1 - t_blend) * color0 + t_blend * color1;
          } 
          else {
            assert(false);
            gradient_color = gradient_colors[num_colors - 1];
          }
          row[i] = unpremult(gradient_color);
         
          x_prime += inv[0];
          y_prime += inv[1];


      }

      
    }
    }

  private:
    GPoint center;
    float radius;
    int count;
    std::vector<GColor> gradient_colors;
    GMatrix inv;
    GTileMode tile_mode;

};

class NonlinearGradientShader : public GShader {
  public:
    NonlinearGradientShader(const GPoint pt0, const GPoint pt1, const GColor colors[], const float weights[], int count, const GTileMode tileMode) :  P0(pt0), P1(pt1), count(count), TileMode(tileMode) {
      float c =  0.5f * weights[0];
      midpoints.push_back(c);
      for (int i = 0; i < count - 1; i++) {
        gradient_colors.push_back((colors[i]));
        c += 0.5f * weights[i] + 0.5f * weights[i+1];
        midpoints.push_back(c);
      }
      gradient_colors.push_back((colors[count - 1]));
      midpoints.push_back(1.0f);

    }

    bool isOpaque() override { return false; }

    bool setContext(const GMatrix& ctm) override {

      GMatrix transform = GMatrix(
        P1.x - P0.x,    -(P1.y - P0.y),   P0.x,
        P1.y - P0.y,    P1.x - P0.x,      P0.y
      );
      GMatrix m = ctm * transform;
      if (auto inv = m.invert()) {
        Inv = *inv;
        return true;
      }
      return false;

    }

 


    void shadeRow(int x, int y, int c, GPixel row[]) override {

      if (count == 1) {

        GPixel pix = unpremult(gradient_colors[0]);
        for (int i = 0; i < c; i++) row[i] = pix;
        return;

      }

      float xpr = (Inv[0] * (x + 0.5f) + Inv[2] * (y + 0.5f) + Inv[4]) * (count - 1);
      float currX = xpr;
      float prop;

      int k;
      GColor mix;

      switch (TileMode) {
        case GTileMode::kClamp:
          for (int i = 0; i < c; i++) {
            currX = xpr;
            if (currX < 0) currX = 0;
            if (currX > count - 1) currX = count - 1;
            
            prop = currX / (count - 1);
            k = 0;

            while (true) {
              if (prop > midpoints[k]) {
                k++;
              } else {
                break;
              }
            }
            assert(prop <= midpoints[k]);

            float fullDiff;
            float propDiff;

            if (k == 0) {
              mix = gradient_colors[k];
            } else if (k < count) {

              fullDiff = midpoints[k] - midpoints[k - 1];
              propDiff = prop - midpoints[k - 1];
              
              float propC1 = propDiff / fullDiff;
              assert(propC1 >= 0.0f && propC1 <= 1.0f);

              mix = gradient_colors[k] * propC1 + gradient_colors[k - 1] * (1.0f - propC1);

            } else {
              mix = gradient_colors[k - 1];
            }
            row[i] = unpremult(mix);
            xpr += Inv[0] * (count - 1);
          }
          break;
        case GTileMode::kMirror:
          for (int i = 0; i < count; i++) {
            currX = xpr;
            currX = fmod(currX, 2 * (count - 1));
            if (currX > count - 1) {
              currX = 2 * (count - 1) - currX;
            }

            prop = currX / (count - 1);
            k = 0;

            while (true) {
              if (prop > midpoints[k]) {
                k++;
              } else {
                break;
              }
            }

            assert(prop <= midpoints[k]);
            float fullDiff;
            float propDiff;

            if (k == 0) {
              mix = gradient_colors[k];
            } else if (k < count) {
              fullDiff = midpoints[k] - midpoints[k - 1];
              propDiff = prop - midpoints[k - 1];

              float propC1 = propDiff / fullDiff;

              assert(propC1 >= 0.0f && propC1 <= 1.0f);

              mix = gradient_colors[k] * propC1 + gradient_colors[k - 1] * (1.0f - propC1);
            } else {
              mix = gradient_colors[k - 1];
            }
            row[i] = unpremult(mix);
            xpr += Inv[0] * (count - 1);
          }

          break;

        case GTileMode::kRepeat:
          for (int i = 0; i < count; i++) {
            currX = xpr;
            currX = fmod(currX, (float) count - 1);

            prop = currX / (count - 1);
            k = 0;

            while (true) {
              if (prop > midpoints[k]) {
                k++;
              } else {
                break;
              }
            }

            assert(prop <= midpoints[k]);

            float fullDiff;
            float propDiff;

            if (k == 0) {
              mix = gradient_colors[k];
            } else if (k < count) {
              fullDiff = midpoints[k] - midpoints[k - 1];
              propDiff = prop - midpoints[k - 1];

              float propC1 = propDiff / fullDiff;

              assert(propC1 >= 0.0f && propC1 <= 1.0f);
              mix = gradient_colors[k] * propC1 + gradient_colors[k - 1] * (1.0f - propC1);
            } else {
              mix = gradient_colors[k - 1];
            }
            row[i] = unpremult(mix);
            xpr += Inv[0] * (count - 1);
          }
          break;
        default:
          break;
      }
    }

  private:

    const GPoint P0;
    const GPoint P1;
    int count;
    const GTileMode TileMode;
    std::vector<float> Proportions {};
    std::vector<float> midpoints {};
    std::vector<GColor> gradient_colors {};
    GMatrix Inv;
};

class AngleGradientShader:public GShader{
  public:
    AngleGradientShader(GPoint p0, GPoint p1, const GColor colors[], int count) : P0(p0), P1(p1), count(count) {
      for (int i = 0; i < count; i++){
        gradient_colors.push_back(colors[i]);
      }
      gradient_colors.push_back(colors[count - 1]);
    }

    bool isOpaque() override{
      return false;
    }

    bool setContext(const GMatrix& ctm) override{
      GMatrix linear_transformation_matrix = GMatrix(
        P1.x - P0.x,    -(P1.y - P0.y),   P0.x,
        P1.y - P0.y,    P1.x - P0.x,      P0.y
      );
      
      GMatrix temp = ctm * linear_transformation_matrix;
      if(auto inverted = temp.invert()){
          inv = *inverted;
          return true;
      }
      return false;
    }

    void shadeRow(int x, int y, int c, GPixel row[]) override {
      float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]) * (count - 1);
      float y_prime = (inv[1] * (x + 0.5f) + inv[3] * (y + 0.5f) + inv[5]) * (count - 1);

      float dx = P1.x - P0.x;
      float dy = P1.y - P0.y;

      // Calculate the angle (in radians) of the line segment
      float line_angle = std::atan2(dy, dx);

      for (int i = 0; i < c; i++) {
          // Calculate the angle (in radians) between the line segment and the pixel
          float angle_to_pixel = std::atan2(y_prime - P0.y, x_prime - P0.x);

          // Normalize the angle to [0, 2*pi]
          if (angle_to_pixel < 0) {
              angle_to_pixel += 2 * M_PI;
          }

          // Calculate the relative angle between the pixel and the line segment
          float angle = angle_to_pixel - line_angle;

          // Ensure the angle is in the range [0, 2*pi]
          if (angle < 0) {
              angle += 2 * M_PI;
          }

          // Normalize angle to [0, 1]
          float t = angle / (2 * M_PI);

          // Interpolate between colors based on t
          int k = floor(t * (count - 1));
          float u = t * (count - 1) - k;

          GColor gradient_color = (1 - u) * gradient_colors[k] + u * gradient_colors[k + 1];

          row[i] = unpremult(gradient_color);

          // Update x_prime and y_prime for the next pixel
          x_prime += inv[0];
          y_prime += inv[1];
      

            
        }
      }


  private:
    GPoint P0;
    GPoint P1;
    int count;
    std::vector<GColor> gradient_colors;
    GMatrix inv;

};

 
std::unique_ptr<GShader> GCreateBitmapShader(const GBitmap& fDevice, const GMatrix& fMat, GTileMode TileMode){
        return std::unique_ptr<GShader>(new MyBMShader(fDevice, fMat, TileMode));
}

std::unique_ptr<GShader> GCreateBilerpBitmapShader(const GBitmap& fDevice, const GMatrix& fMat, GTileMode TileMode){
        return std::unique_ptr<GShader>(new MyBilerpBMShader(fDevice, fMat, TileMode));
}

std::unique_ptr<GShader> GCreateLinearGradient(GPoint p0, GPoint p1, const GColor colors[], int count, GTileMode TileMode){
        return std::unique_ptr<GShader>(new MyGradientShader(p0, p1, colors, count, TileMode));
}

std::unique_ptr<GShader> GCreateTriColorShader(const GPoint points[], const GColor colors[], int count){
  return std::unique_ptr<GShader>(new TriColorShader(points, colors, count));
}

std::unique_ptr<GShader> GCreateProxyShader(GShader* shader1, GMatrix mat){
  return std::unique_ptr<GShader>(new ProxyShader(shader1, mat));
}

std::unique_ptr<GShader> GCreateComposeShader(GShader* shader1, GShader* shader2){
  return std::unique_ptr<GShader>(new ComposeShader(shader1, shader2));
}

std::unique_ptr<GShader> GCreateRadialGradientShader(const GPoint& center, float radius, const GColor colors[], int count, GTileMode tileMode){
  return std::unique_ptr<GShader>(new RadialGradientShader(center, radius, colors, count, tileMode));
}

std::unique_ptr<GShader> GCreateNonlinearGradientShader(GPoint p0, GPoint p1, const GColor colors[], const float intervals[], int count, GTileMode TileMode) {
    return std::unique_ptr<GShader>(new NonlinearGradientShader(p0, p1, colors, intervals, count, TileMode));
}

std::unique_ptr<GShader> GCreateAngleGradientShader(GPoint p0, GPoint p1, const GColor colors[], int count) {
    return std::unique_ptr<GShader>(new AngleGradientShader(p0, p1, colors, count));
}



float clamp(float curr, int count){
  if(curr < 0){
    return 0.0f;
  }
  if(curr > count - 1){
    return float(count - 1);
  }
  return curr;
}

float repeat(float curr, int count){
  return fmod(curr, count - 1);
}

float mirror(float curr, int count){
  curr = fmod(curr, 2*(count - 1));
  if(curr > count - 1){
    float temp = curr;
    curr = 2*(count-1) - temp;
  }
  return curr;
}

void shadeFillPolygon(GShader* sh, std::vector<Edge> edges, GBitmap fDevice, std::vector<GMatrix> ctm, BlendProc proc){
    int bot = edges[0].bottom;
    int t = edges[edges.size() - 1].top;

    Edge a = edges[edges.size() - 1];
    Edge b = edges[edges.size() - 2];

    //CHECK if edges is empty, if it is, don't draw
    for(int i = t; i <= bot; i++){
        
        //find left and right
        int aIntersect = GRoundToInt(a.eval(i));
        int bIntersect = GRoundToInt(b.eval(i));

        if(aIntersect > bIntersect){
            swap(aIntersect, bIntersect);
        }
        
        int pixels_in_row = bIntersect - aIntersect;
        
        GPixel row[pixels_in_row];
        if(aIntersect < fDevice.width()){
          sh->shadeRow(aIntersect, i, pixels_in_row, row);
          for(int j = 0; j < pixels_in_row; j++){
            assert(GPixel_GetA(row[j]) <= 255);
            assert(GPixel_GetR(row[j]) <= GPixel_GetA(row[j]));
            assert(GPixel_GetG(row[j]) <= GPixel_GetA(row[j]));
            assert(GPixel_GetB(row[j]) <= GPixel_GetA(row[j]));
            
          }
          shadeBlendRow(aIntersect, i, pixels_in_row, proc, fDevice, row);
        }
         
        if(b.lastRow(i)){
            edges.pop_back();
            if(edges.empty()){
                break;
            } 
            if(edges.size() == 1){
                b = edges[edges.size()-1];
            }  
            else{
                b = edges[edges.size()-2];
            }         

        }
        if (a.lastRow(i)){
            edges.pop_back();
            if(edges.empty()){
                break;
            }
            a = edges[edges.size()-2];

        }
    }
}
#endif

