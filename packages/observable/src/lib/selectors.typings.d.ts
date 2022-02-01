import { MemoizedSelector, MemoizedSelectorWithProps, Selector, SelectorWithProps } from '@ngrx/store'

declare module '@ngrx/store' {
  export declare function createSelector<State, S1, Result>(
    s1: Selector<State, S1>,
    projector: (s1: S1) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    projector: (s1: S1, s2: S2) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, Result>(
    selectors: [Selector<State, S1>, Selector<State, S2>],
    projector: (s1: S1, s2: S2) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    projector: (s1: S1, s2: S2, s3: S3) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, Result>(
    selectors: [Selector<State, S1>, Selector<State, S2>, Selector<State, S3>],
    projector: (s1: S1, s2: S2, s3: S3) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, Result>(
    selectors: [Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    s11: Selector<State, S11>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10, s11: S11) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>,
      Selector<State, S11>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10, s11: S11) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    s11: Selector<State, S11>,
    s12: Selector<State, S12>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12
    ) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>,
      Selector<State, S11>,
      Selector<State, S12>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12
    ) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    s11: Selector<State, S11>,
    s12: Selector<State, S12>,
    s13: Selector<State, S13>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13
    ) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>,
      Selector<State, S11>,
      Selector<State, S12>,
      Selector<State, S13>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13
    ) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, Result>(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    s11: Selector<State, S11>,
    s12: Selector<State, S12>,
    s13: Selector<State, S13>,
    s14: Selector<State, S14>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14
    ) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, Result>(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>,
      Selector<State, S11>,
      Selector<State, S12>,
      Selector<State, S13>,
      Selector<State, S14>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14
    ) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<
    State,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    Result
  >(
    s1: Selector<State, S1>,
    s2: Selector<State, S2>,
    s3: Selector<State, S3>,
    s4: Selector<State, S4>,
    s5: Selector<State, S5>,
    s6: Selector<State, S6>,
    s7: Selector<State, S7>,
    s8: Selector<State, S8>,
    s9: Selector<State, S9>,
    s10: Selector<State, S10>,
    s11: Selector<State, S11>,
    s12: Selector<State, S12>,
    s13: Selector<State, S13>,
    s14: Selector<State, S14>,
    s15: Selector<State, S15>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14,
      s15: S15
    ) => Result
  ): MemoizedSelector<State, Result>
  export declare function createSelector<
    State,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    Result
  >(
    selectors: [
      Selector<State, S1>,
      Selector<State, S2>,
      Selector<State, S3>,
      Selector<State, S4>,
      Selector<State, S5>,
      Selector<State, S6>,
      Selector<State, S7>,
      Selector<State, S8>,
      Selector<State, S9>,
      Selector<State, S10>,
      Selector<State, S11>,
      Selector<State, S12>,
      Selector<State, S13>,
      Selector<State, S14>,
      Selector<State, S15>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14,
      s15: S15
    ) => Result
  ): MemoizedSelector<State, Result>

  export declare function createSelector<State, Props, S1, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    projector: (s1: S1) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    projector: (s1: S1, s2: S2) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, Result>(
    selectors: [Selector<State, S1>, SelectorWithProps<State, Props, S2>],
    projector: (s1: S1, s2: S2) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    projector: (s1: S1, s2: S2, s3: S3) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, Result>(
    selectors: [Selector<State, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>],
    projector: (s1: S1, s2: S2, s3: S3) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, Result>(
    selectors: [
      Selector<State, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    s11: SelectorWithProps<State, Props, S11>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10, s11: S11) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>,
      SelectorWithProps<State, Props, S11>
    ],
    projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10, s11: S11) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    s11: SelectorWithProps<State, Props, S11>,
    s12: SelectorWithProps<State, Props, S12>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>,
      SelectorWithProps<State, Props, S11>,
      SelectorWithProps<State, Props, S12>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, Result>(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    s11: SelectorWithProps<State, Props, S11>,
    s12: SelectorWithProps<State, Props, S12>,
    s13: SelectorWithProps<State, Props, S13>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, Result>(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>,
      SelectorWithProps<State, Props, S11>,
      SelectorWithProps<State, Props, S12>,
      SelectorWithProps<State, Props, S13>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<
    State,
    Props,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    Result
  >(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    s11: SelectorWithProps<State, Props, S11>,
    s12: SelectorWithProps<State, Props, S12>,
    s13: SelectorWithProps<State, Props, S13>,
    s14: SelectorWithProps<State, Props, S14>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<
    State,
    Props,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    Result
  >(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>,
      SelectorWithProps<State, Props, S11>,
      SelectorWithProps<State, Props, S12>,
      SelectorWithProps<State, Props, S13>,
      SelectorWithProps<State, Props, S14>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>

  export declare function createSelector<
    State,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    Result
  >(
    s1: SelectorWithProps<State, Props, S1>,
    s2: SelectorWithProps<State, Props, S2>,
    s3: SelectorWithProps<State, Props, S3>,
    s4: SelectorWithProps<State, Props, S4>,
    s5: SelectorWithProps<State, Props, S5>,
    s6: SelectorWithProps<State, Props, S6>,
    s7: SelectorWithProps<State, Props, S7>,
    s8: SelectorWithProps<State, Props, S8>,
    s9: SelectorWithProps<State, Props, S9>,
    s10: SelectorWithProps<State, Props, S10>,
    s11: SelectorWithProps<State, Props, S11>,
    s12: SelectorWithProps<State, Props, S12>,
    s13: SelectorWithProps<State, Props, S13>,
    s14: SelectorWithProps<State, Props, S14>,
    s15: SelectorWithProps<State, Props, S15>,
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14,
      s15: S15
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
  export declare function createSelector<
    State,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    Result
  >(
    selectors: [
      SelectorWithProps<State, Props, S1>,
      SelectorWithProps<State, Props, S2>,
      SelectorWithProps<State, Props, S3>,
      SelectorWithProps<State, Props, S4>,
      SelectorWithProps<State, Props, S5>,
      SelectorWithProps<State, Props, S6>,
      SelectorWithProps<State, Props, S7>,
      SelectorWithProps<State, Props, S8>,
      SelectorWithProps<State, Props, S9>,
      SelectorWithProps<State, Props, S10>,
      SelectorWithProps<State, Props, S11>,
      SelectorWithProps<State, Props, S12>,
      SelectorWithProps<State, Props, S13>,
      SelectorWithProps<State, Props, S14>,
      SelectorWithProps<State, Props, S15>
    ],
    projector: (
      s1: S1,
      s2: S2,
      s3: S3,
      s4: S4,
      s5: S5,
      s6: S6,
      s7: S7,
      s8: S8,
      s9: S9,
      s10: S10,
      s11: S11,
      s12: S12,
      s13: S13,
      s14: S14,
      s15: S15
    ) => Result
  ): MemoizedSelectorWithProps<State, Props, Result>
}
