import React, { Component } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getPosts } from '../redux';

class List extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.startLoading = this.startLoading.bind(this);
    this.state = {
      error: null,
      user,
      isLoading: false
    };
  }

  componentDidMount() {
    const { posts } = this.props;
    if (!posts) {
      this.startLoading();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user
      });
    }
    if (nextProps.posts !== this.props.posts) {
      this.setState({
        isLoading: false
      })
    }
  }

  startLoading() {
    console.log('start loading');
    const { posts, getPosts } = this.props;
    this.setState({
      isLoading: true
    }, () => {
      getPosts(20, (posts && posts.length) ? posts[posts.length - 1] : null);
    });
  }

  render() {
    const { dbUser, posts, error } = this.props;
    const { isLoading } = this.state;
    const isMore = posts && posts.length < dbUser.postsSize;
    const isLoadingEnabled = !isLoading && isMore;
    const activityIndicator = isMore ? (
      <ActivityIndicator
        animating
        size="large"
        style={{
          marginTop: 16,
          marginBottom: 16
        }}
      />
    ) : null;
    return (
      <View
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
                title={item.data().order.toString()}
                subtitle={item.data().text}
                bottomDivider
              />
            )}
            onEndReached={isLoadingEnabled ? this.startLoading : null}
            onEndReachedThreshold={0}
            ListFooterComponent={activityIndicator}
          />
        ) : null}
        {error ? <Text>{error}</Text> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  dbUser: state.user.dbData,
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
