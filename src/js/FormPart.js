import React from 'react';
import {View, TextInput, Text} from 'react-native';

// export const onChangeText = (props) => {
//   props.onChange();
// };

export const FormPart = (props) => {
  return (
    <View>
      <View>
        <Text>タイトル</Text>
        <TextInput
          type="text"
          name="title"
          value={props.title}
          onChangeText={props.onChange('title')}
        />
      </View>
      <View>
        <Text>本文</Text>
        <TextInput
          type="text"
          name="description"
          value={props.description}
          onChangeText={props.onChange('description')}
        />
      </View>
    </View>
  );
};
