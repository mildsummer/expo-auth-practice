import React, { Component } from 'react';
import { SafeAreaView, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getPosts } from '../redux';

class List extends Component {
  constructor(props) {
    super(props);
    const { user, getPosts } = props;
    getPosts();
    this.state = {
      error: null,
      user
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user
      });
    }
  }

  render() {
    const { posts, error } = this.props;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: '100%'
        }}
      >
        {posts ? (
          <FlatList
            data={posts}
            keyExtractor={(item) => (item.id)}
            renderItem={({ item }) => (
              <ListItem
                title={item.data().text}
                bottomDivider
              />
            )}
          />
        ) : null}
        {error ? <Text>{error}</Text> : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  posts: state.user.posts,
  error: state.user.signOutError
});

const mapDispatchToProps = {
  getPosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
