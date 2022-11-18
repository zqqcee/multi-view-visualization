# 数据浏览平台

## 安装

```bash
npm install
```

因为里面有两个包冲突了```craco```和```react-script```，所以```npm install```可能会报错，报错可以执行以下指令

```bash
npm install --force
```

## 运行

```
npm start
```

访问```localhost:3000```即可使用



## 新数据测试

##### 数据集存放地址

> src/assets

这里存放了全部数据集，里面按照数据集的类别分了不同目录，目录说明如下：

- nodealarming：有节点告警的数据（但是没有连边告警）
- linkalarming：有节点告警和连边告警的数据
- ratioscale：对现有数据集的等比缩放**（wh提供）**
- struct2：按照客户新提供的组网结构2构造的新数据**（dhc提供）**
- other：未分类数据

##### 数据集入口

> src/util

utils文件夹中，```getData.js```是配置数据集的地方。如果要添加数据集请按照以下步骤在这个文件中修改

- Step1:

按照上述的类别，将数据集存放到对应目录下。

- Step2：

修改```/src/utils/getData.js```

```js
//首先，引入数据集
import casexxxx from "../assets/${path}" // 在引入的时候，把 "casexxxx" 换成你的要引入的数据集，把${path}换成它对应的路径

//接着，在generate函数中的datasets中添加这个数据集
export default function generate() {

    const datasets = {
        case1,
        case2,
        case3,
        case4,
        case5,
        case6,
        case7,
        case8,
        case9,
        case10,
      	casexxxxxs, //你的新数据集
    }

    return datasets;
}
```

- Step3：重新编译



## 功能说明

![image-20221117161356807](https://raw.githubusercontent.com/zqqcee/img_repo/main/img/202211171614633.png)

蓝色方框为**数据选择器**

红色方框可以设置**是否打开专注模式**。

> 专注模式：只绘制用户选中的节点

## 使用建议

- 在观察数据中的分布及占比的时候，建议使用非专注模式
- 在观察某个区域中的组网结构，设备的连接方式等，建议使用专注模式
- 注意！！：频繁切换模式可能导致更新不及时，而出现画布绘制不正确的情况。刷新即可

> FIXME:拖拽功能，过滤节点的数量计算功能，层次化布局正在开发中



## 更新日志

```FIXME(2022-11-18)```：新增显示告警功能

- 构造好告警数据集后，即可在数据集中看到有多少告警的数量。

![image-20221118165005427](https://raw.githubusercontent.com/zqqcee/img_repo/main/img/202211181650159.png)

- 是否展示告警数据是一个配置项，在```src/components/Canvas/constants.js```中，修改

  ```json
      alarming: {
          node: {
              fill: 'red',
              radius: 15,
              flag: false,//全局开关 ,如果不想看告警，只想看结构可以修改为false
          },
          link: {
              stroke: 'red',
              strokeWidth: 4,
              flag: false,//全局开关，如果不想看告警，只想看结构可以修改为false
          }
      }
  ```

  

