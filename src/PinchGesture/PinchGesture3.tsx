import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Value,
  and,
  block,
  cond,
  eq,
  max,
  multiply,
  set,
  sub,
  useCode,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import {
  clamp,
  onGestureEvent,
  pinchActive,
  pinchBegan,
  timing,
  translate,
  vec,
} from "react-native-redash";

const { width, height } = Dimensions.get("window");
const CANVAS = vec.create(width, height);
const CENTER = vec.divide(CANVAS, 2);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
});

export default () => {
  const origin = vec.createValue(0);
  const pinch = vec.createValue(0);
  const focal = vec.createValue(0);
  const gestureScale = new Value(1);
  const numberOfPointers = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const pinchGestureHandler = onGestureEvent({
    numberOfPointers,
    scale: gestureScale,
    state,
    focalX: focal.x,
    focalY: focal.y,
  });

  const pan = vec.createValue(0);
  const panState = new Value(State.UNDETERMINED);
  const panGestureHandler = onGestureEvent({
    translationX: pan.x,
    translationY: pan.y,
    state: panState,
  });

  const scaleOffset = new Value(1);
  const scale = new Value(1);
  const minVec = vec.min(vec.multiply(-0.5, CANVAS, sub(scale, 1)), 0);
  const maxVec = vec.max(vec.invert(minVec), 0);
  const offset = vec.createValue(0);
  const translation = vec.createValue(0);
  const adjustedFocal = vec.sub(focal, vec.add(CENTER, offset));
  useCode(
    () =>
      block([
        cond(eq(panState, State.ACTIVE), vec.set(translation, pan)),
        cond(pinchBegan(state), vec.set(origin, adjustedFocal)),
        cond(pinchActive(state, numberOfPointers), [
          vec.set(pinch, vec.sub(adjustedFocal, origin)),
          vec.set(
            translation,
            vec.add(pinch, origin, vec.multiply(-1, gestureScale, origin))
          ),
        ]),
        cond(and(eq(state, State.END), eq(panState, State.END)), [
          vec.set(offset, vec.add(offset, translation)),
          set(scaleOffset, scale),
          set(gestureScale, 1),
          vec.set(translation, 0),
          vec.set(focal, 0),
          vec.set(pinch, 0),
          set(
            offset.x,
            timing({
              from: offset.x,
              to: clamp(offset.x, minVec.x, maxVec.x),
            })
          ),
          set(
            offset.y,
            timing({
              from: offset.y,
              to: clamp(offset.y, minVec.y, maxVec.y),
            })
          ),
          set(
            scaleOffset,
            timing({ from: scaleOffset, to: max(scaleOffset, 1) })
          ),
        ]),
        set(scale, multiply(gestureScale, scaleOffset)),
      ]),
    [
      adjustedFocal,
      focal,
      gestureScale,
      maxVec.x,
      maxVec.y,
      minVec.x,
      minVec.y,
      numberOfPointers,
      offset,
      origin,
      pan,
      panState,
      pinch,
      scale,
      scaleOffset,
      state,
      translation,
    ]
  );
  return (
    <View style={styles.container}>
      <PinchGestureHandler {...pinchGestureHandler}>
        <Animated.View style={StyleSheet.absoluteFillObject}>
          <PanGestureHandler {...panGestureHandler}>
            <Animated.View style={StyleSheet.absoluteFill}>
              <Animated.Image
                style={[
                  styles.image,
                  {
                    transform: [
                      ...translate(vec.add(offset, translation)),
                      { scale },
                    ],
                  },
                ]}
                source={require("./assets/zurich.jpg")}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};
