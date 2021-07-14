import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import './index.scss'

export default function PostCard(props) {
  const handleClick = () => {
    if(props.isList){
      const { title,content } = props
      Taro.navigateTo({
        url: `/pages/post/post?title=${title}&content=${content}`
      })
    }
  }

  return (
    <View 
      className={classNames('postcard',{postcard__isList: props.isList})} 
      onClick={handleClick}>
      <View className="post-title">{props.title}</View>
      <View className="post-content">{props.content}</View>
    </View>
  )
}

PostCard.defaultProps = {
  isList: '',
}