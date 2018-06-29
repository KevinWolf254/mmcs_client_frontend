import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export let slideLeftRight = trigger('slide',[
    state('left', style({
      transform: 'translateX(-100%)'
    })),
    transition('left <=> *', animate(5000))
  ]);