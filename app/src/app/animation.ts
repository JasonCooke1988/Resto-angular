import {animate, animateChild, group, query, stagger, state, style, transition, trigger} from "@angular/animations";

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home => RestoAdmin', [
      style({position: 'relative'}),
      query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ],
        {
          optional: true
        }
      ),
      query(':enter', [
          style({left: '-100%'})
        ],
        {
          optional: true
        }),
      query(':leave', animateChild(),
        {
          optional: true
        }),
      group([
        query(':leave', [
            animate('300ms ease-out', style({left: '100%'}))
          ],
          {
            optional: true
          }),
        query(':enter', [
            animate('300ms ease-out', style({left: '0%'}))
          ],
          {
            optional: true
          }),
      ]),
    ]),
    transition('RestoAdmin => Home', [
      style({position: 'relative'}),
      query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%'
          })
        ],
        {
          optional: true
        }
      ),
      query(':enter', [
          style({right: '-100%'})
        ],
        {
          optional: true
        }),
      query(':leave', animateChild(),
        {
          optional: true
        }),
      group([
        query(':leave', [
            animate('300ms ease-out', style({right: '100%'}))
          ],
          {
            optional: true
          }),
        query(':enter', [
            animate('300ms ease-out', style({right: '0%'}))
          ],
          {
            optional: true
          }),
      ]),
    ])
    // transition('* <=> *', [
    //   style({position: 'relative'}),
    //   query(':enter, :leave', [
    //       style({
    //         position: 'absolute',
    //         top: 0,
    //         right: 0,
    //         width: '100%'
    //       })
    //     ],
    //     {
    //       optional: true
    //     }),
    //   query(':enter', [
    //       style({right: '-100%'})
    //     ],
    //     {
    //       optional: true
    //     }),
    //   query(':leave', animateChild(),
    //     {
    //       optional: true
    //     }),
    //   group([
    //     query(':leave', [
    //         animate('300ms ease-out', style({right: '100%', opacity: 0}))
    //       ],
    //       {
    //         optional: true
    //       }),
    //     query(':enter', [
    //         animate('300ms ease-out', style({right: '0%'}))
    //       ],
    //       {
    //         optional: true
    //       }),
    //     query('@*', animateChild(),
    //       {
    //         optional: true
    //       })
    //   ]),
    // ])
  ]);

export const mouseState =
  trigger('mouseState', [
    state('move', style({
      cursor: 'move',
    })),
    state('ne-resize', style({
      cursor: 'nesw-resize',
    })),
    state('nw-resize', style({
      cursor: 'nwse-resize',
    })),
    state('se-resize', style({
      cursor: 'nwse-resize',
    })),
    state('sw-resize', style({
      cursor: 'nesw-resize',
    })),
    state('n-resize', style({
      cursor: 'ns-resize',
    })),
    state('s-resize', style({
      cursor: 'ns-resize',
    })),
    state('e-resize', style({
      cursor: 'ew-resize',
    })),
    state('w-resize', style({
      cursor: 'ew-resize',
    })),
    state('default', style({
      cursor: 'default',
    }))
  ])

export const popInAnimation =
  trigger(
    'popInAnimation', [
      transition(":enter", [
        style({opacity: 0, transform: "scale(0.985)"}), //apply default styles before animation starts
        animate(
          "150ms ease-in-out",
          style({opacity: 0.75, transform: "scale(1.015)"})
        ),
        animate(
          "150ms ease-in-out",
          style({opacity: 1, transform: "scale(1)"})
        )
      ]),
      transition(":leave", [
        style({opacity: 1, transform: "scale(1)"}), //apply default styles before animation starts
        animate(
          "150ms ease-in-out",
          style({opacity: 0, transform: "scale(1.015)"})
        ),
        animate(
          "150ms ease-in-out",
          style({opacity: 0, transform: "scale(0.985)"})
        )
      ])
    ]
  )
