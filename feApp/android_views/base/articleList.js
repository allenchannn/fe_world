/**
 * Created by linGo on 2018/2/6.
 */
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip

class ArticleItem extends  React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      article: this.props.article,
      like: this.props.article.like,
      allCommentCount: 0,
      likeCount: this.props.article.meta.likeCount
      /*likeCount: this.props.article.meta.likeCount,
      commentCount: this.props.article.comment.length*/
    }
    if(!this.props.article.author){
      this.setState({
        article: Object.assign(this.state.article, {
          author: {
            avatarLarge: ip + '/images/mying.png',
            username: '佚名'
          }
        })
      })
    }

    this._getAllCommentCount()
  }

  _getAllCommentCount(){
    var articleId = this.state.article._id;
    var url = ip + '/article/all_comment_count?id=' + articleId

    fetch(url)
      .then(res => res.json())
      .then( data => {
        if(data.ret == 0){
          this.setState({
            allCommentCount: parseInt(data.data)
          })
        }
      })
  }

  _onPress = () => {

  }

  _like() {
    var url = ip + (this.state.like? '/article/dislike' : '/article/like') + '?id=' + this.state.article._id,
      inc = this.state.like?-1:1
    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          Alert.alert(
            '提示',
            data.message,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
          this.setState({
            like: !this.state.like,
            likeCount: this.state.likeCount + inc
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登陆', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }

    })
  }

  _comment(_id){
    console.log('lin',_id)
    this.props.navigation.navigate('ArticleComment', {'articleId': _id})
  }

  _readArticle(_id) {
    console.log('articleId ' + _id)
    this.props.navigation.navigate('Detail', {'articleId': _id})
  }

  _showUser(){
    this.props.navigation.navigate('UserProfile')
  }

  render() {
    return (
    <View style = {styles.wrapper}>
      <View style = {styles.item}>
        <View style = {styles.header}>
          <View style={[styles.authorInfo, styles.header]}>
            <View style = {[{marginRight: 5}]}>
              <Image style={styles.portrait}
                      //source={require('../../resource/image/mying.png')}
                     onPress={this._showUser.bind(this)}
                    source={{uri: this.state.article.author.avatarLarge}}
              />
            </View>
            <Text style = {[styles.height, {color: '#000000'}]}
                  onPress={this._showUser.bind(this)}
            >{this.state.article.author.username}</Text>
          </View>
          <View style={[styles.userTag]}>
            <Text style={[styles.height, {color: '#cccccc'}]}>{this.state.article.tag.slice(0,2).join('/')}</Text>
          </View>
        </View>
        <View style={styles.main}>
          <Text style={styles.articleTitle}>{this.state.article.title}</Text>
          <Text style={styles.articleContent}
                onPress={this._readArticle.bind(this, this.state.article._id)}
          >
            {this.state.article.shortContent}
          </Text>
        </View>
        <View style = {styles.footer}>
          <View style = {styles.handleBox}>
            <Icon
              name={this.state.like?'thumbs-up':'thumbs-o-up'}
              size={15}
              color='orange'
              onPress={this._like.bind(this)}
            />
            <Text style= {styles.like}>
              {this.state.likeCount}
              </Text>
          </View>
          <View style = {styles.handleBox}>
            <Icon
              name="comments-o"
              color="orange"
              size={15}
              onPress = {this._comment.bind(this, this.state.article._id)}
            />
            <Text style= {styles.comment}>{this.state.allCommentCount}</Text>
          </View>
        </View>
      </View>
    </View>
    )
  }
}

class ArticleList extends  React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      articleList: this.props.articleList
    }
  };

  _renderItem = ({item}) => (
    <ArticleItem
      article = {item}
      navigation = {this.props.navigation}
    />
  );

  _loadMoreData() {
    console.log('loading more data')
    this.props.loadMoreData()
  }

  componentDidMount() {
    // console.log(this.props.articleList)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      articleList: nextProps.articleList
    })
     // console.log(this.state.articleList)
  }

  render(){
    return (
      <FlatList
        data={this.state.articleList}
        renderItem = {this._renderItem}
        onEndReachedThreshold={0.1}
        onEndReached = {this._loadMoreData.bind(this)}
      />
    )

  }


}

module.exports = ArticleList;

const headerHeight = 20

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 10,
    borderBottomColor: '#eee',
    backgroundColor: 'white'
  },
  item: {
    marginLeft: 10,
  },
  header: {
    position: 'relative',
    height: headerHeight,
    marginTop: 3
  },
  authorInfo: {
    flexDirection: 'row',
    // marginLeft: 10
  },
  userTag: {
    position: 'absolute',
    right: 5,
    top: 3,
    height: headerHeight
  },
  height: {
    height: headerHeight,
    lineHeight: headerHeight
  },
  portrait: {
    width: headerHeight-2,
    height: headerHeight-3,
    overflow: 'hidden',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode:'cover',
    backgroundColor: 'transparent'
  },
  main: {
    marginTop: 8
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#000'
  },
  articleContent: {
    fontSize: 12,
    color: '#333'
  },

  footer: {
    flexDirection: 'row',
    marginTop: 5
  },
  handleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30
  }


});