import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getPosts } from '../redux';

class List extends Component {
  constructor(props) {
    super(props);
    this.startLoading = this.startLoading.bind(this);
    this.state = {
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
    if (nextProps.posts !== this.props.posts) {
      this.setState({
        isLoading: false
      })
    }
  }

  startLoading() {
    const { posts, getPosts } = this.props;
    this.setState({
      isLoading: true
    }, () => {
      getPosts(20, (posts && posts.length) ? posts[posts.length - 1] : null);
    });
  }

  render() {
    const { dbUser, posts } = this.props;
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
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dbUser: state.user.dbData,
  posts: state.user.posts
});

const mapDispatchToProps = {
  getPosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
