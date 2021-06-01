import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Dot } from "./dot";

@Component({
  selector: 'app-triangles',
  templateUrl: './triangles.component.html',
  styleUrls: ['./triangles.component.less']
})
export class TrianglesComponent implements AfterViewInit {

  constructor() { }

  @ViewChild("wrapper", {static: false}) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild("canvas", {static: false}) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private FPS: number = 40;
  private dotCount: number;
  private w : number;
  private h: number;
  private framesLeft: number = 160;

  populateDots(): void {
    for (let i = 0; i < this.dotCount; i++) {
      let myDot : Dot = {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: Math.random() + 1,
        vx: Math.floor(Math.random() * 8) - 4,
        vy: Math.floor(Math.random() * 8) - 4};
      this.dots.push(myDot);
    }
  }

  populateFakeDots(): void {
    let step = 1/(this.dotCount / 2);
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i <= (this.dotCount / 2); i++) {
        let myDot : Dot = {
          x: (this.w - 350) / 2 + i * step * 175 * 2 + Math.floor(Math.random() * 40) - 20,
          sx: (this.w - 350) / 2 + i * step * 175 * 2,
          y: (this.h - 420) / 2 - Math.abs(i * step * 420 * 2 - 420) + 420 + Math.floor(Math.random() * 40) - 20,
          sy: (this.h - 420) / 2 - Math.abs(i * step * 420 * 2 - 420) + 420,
          r: Math.random() + 1,
          vx: (Math.floor(Math.random() * 40) - 20),
          vy: (Math.floor(Math.random() * 30) - 15)};
          if (i <= (this.dotCount / 4)) {
            if (Math.random() < 0.8 && myDot.vx > 0) myDot.vx *= -1;
            if (Math.random() < 0.8 && myDot.vy > 0) myDot.vy *= -1;
          } else {
            if (Math.random() < 0.8 && myDot.vx < 0) myDot.vx *= -1;
            if (Math.random() < 0.8 && myDot.vy < 0) myDot.vy *= -1;
          }
        this.dots.push(myDot);
      }
    }
  }

  ngAfterViewInit(): void {
    this.h = this.wrapper.nativeElement.offsetHeight;
    this.w = this.wrapper.nativeElement.offsetWidth;

    this.canvas.nativeElement.height = this.h;
    this.canvas.nativeElement.width = this.w;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.dotCount = Math.floor(this.w * this.h / 10000);
    //this.populateDots();
    this.populateFakeDots();
    
    const i = setInterval(() => {
      this.draw();
      this.update();
    }, 1 / this.FPS);  

  }


  distance(A : Dot, B : Dot): number {
    return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2))
  }

  draw(): void {
    this.ctx.clearRect(0,0,this.w,this.h);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
    this.ctx.globalCompositeOperation = "lighter";

    this.dots.forEach(dot => {
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.fillStyle = 'black';
      this.ctx.stroke();
    });

    this.ctx.beginPath();
    for (let i = 0; i < this.dots.length - 1; i++) {
      let DotA : Dot = this.dots[i];
      this.ctx.moveTo(DotA.x, DotA.y);

      for (let j = i; j < this.dots.length; j++) {
        let DotB : Dot = this.dots[j];
        if(this.distance(DotA, DotB) < 150) {
          this.ctx.lineTo(DotB.x, DotB.y); 
        }
      }
    }

    this.ctx.lineWidth = 0.05;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }

  update(): void {
    if (this.framesLeft == 0) {
      this.dots.forEach(dot => {

        dot.x += (dot.vx / this.FPS);
        dot.y += (dot.vy / this.FPS);
        
        if (dot.x < 0 || dot.x > this.w) dot.x = Math.abs(this.w - dot.x);
        if (dot.y < 0 || dot.y > this.h) dot.y = Math.abs(this.h - dot.y);
      });
    } else {
      this.dots.forEach(dot => {
        dot.x += (dot.sx - dot.x + dot.vx) / (this.FPS * 2);
        dot.y += (dot.sy - dot.y + dot.vy) / (this.FPS * 2);
      });
      this.framesLeft -= 1;
    }
  }

}
