import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  Text,
  Dimensions
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { Card, StyleGuide, cards } from "../components";

import CheckIcon, { CHECK_ICON_SIZE } from "./CheckIcon";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background
  },
  buttonContainer: {
    borderBottomWidth: 1,
    borderColor: "#f4f6f3"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: StyleGuide.spacing * 2 + CHECK_ICON_SIZE,
    padding: StyleGuide.spacing
  }
});

interface Layout {
  container: ViewStyle;
  child: ViewStyle;
}

const column: Layout = {
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  child: {}
};

const row: Layout = {
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  child: {}
};

const wrap: Layout = {
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  child: {
    flex: 0,
    width: width / 2
  }
};

const stacked: Layout = {
  container: {},
  child: {
    ...StyleSheet.absoluteFillObject
  }
};

const layouts = [
  {
    id: "column",
    name: "Column",
    layout: column
  },
  {
    id: "row",
    name: "Row",
    layout: row
  },
  {
    id: "wrap",
    name: "Wrap",
    layout: wrap
  },
  {
    id: "stacked",
    name: "stacked",
    layout: stacked
  }
];

export default () => {
  const [selectedLayout, setLayout] = useState(column);
  return (
    <>
      <View style={[styles.container, selectedLayout.container]}>
        {cards.map(card => (
          <Card key={card.id} style={selectedLayout.child} {...{ card }} />
        ))}
      </View>
      {layouts.map(({ id, name, layout }) => (
        <SafeAreaView key={id} style={styles.buttonContainer}>
          <RectButton onPress={() => setLayout(layout)}>
            <View style={styles.button} accessible>
              <Text>{name}</Text>
              {selectedLayout === layout && <CheckIcon />}
            </View>
          </RectButton>
        </SafeAreaView>
      ))}
    </>
  );
};
