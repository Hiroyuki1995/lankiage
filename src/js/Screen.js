import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Content,
  Footer,
  FooterTab,
  // Icon,
  Button,
  Text,
} from 'native-base';
// import Icon from 'react-native-vector-icons/Ionicons';
import ListContent from './ListContent';
import AddContent from './AddContent';
import HomeContent from './HomeContent';
import TestContent from './TestContent';

class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'list',
    };
  }

  renderSelectedTab() {
    switch (this.state.selectedTab) {
      case 'home':
        return <HomeContent />;
      case 'list':
        return <ListContent />;
      case 'test':
        return <TestContent />;
      case 'add':
        return <AddContent />;
      default:
    }
  }

  render() {
    return (
      <Container>
        <Content style={styles.content}>{this.renderSelectedTab()}</Content>

        <Footer>
          <FooterTab>
            <Button
              active={this.state.selectedTab === 'home'}
              onPress={() => this.setState({selectedTab: 'home'})}>
              {/* <Icon name="ios-home" /> */}
              <Text>Home</Text>
            </Button>

            <Button
              active={this.state.selectedTab === 'list'}
              onPress={() => this.setState({selectedTab: 'list'})}>
              {/* <Icon name="list" /> */}
              <Text>List</Text>
            </Button>

            <Button
              active={this.state.selectedTab === 'test'}
              onPress={() => this.setState({selectedTab: 'test'})}>
              {/* <Icon name="pencil" /> */}
              <Text>Test</Text>
            </Button>

            <Button
              active={this.state.selectedTab === 'add'}
              onPress={() => this.setState({selectedTab: 'add'})}>
              {/* <Icon name="add" /> */}
              <Text>Add</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#f5f5ff',
  },
});
