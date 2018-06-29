import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export let fadeInOut = trigger('fade',[
    state('void', style({
      opacity: 0
    })),
    transition('void <=> *', animate(1000))
  ]);