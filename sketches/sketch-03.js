const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// const animate = () => {
//   requestAnimationFrame(animate);
// };
// animate();

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return () => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // const point = { x: 800, y: 400, radius: 10};
    // const agentA = new Agent(800, 400);
    // const agentB = new Agent(300, 700);

    // agentA.draw(context);
    // agentB.draw(context);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue; //continue function make skip everything after continue and go to the next step

        //when distance is 0 the line has width = 12, when dist = 200 the line has width 1
        context.lineWidth = math.mapRange(dist, 0, 200, 5, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();

      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
      // agent.wrap(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector { //class usually start with UPPERCASE letter
  constructor(x, y){
    this.x = x; //this means we are referring to the scope of this class
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12); 
  }

  bounce(width, height) {
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1; // '||' this means logical 'or'
    if(this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  wrap(width, height) {
    if(this.pos.x > width) this.pos.x = 0;
    if(this.pos.y > height) this.pos.y = 0;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 2;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}
