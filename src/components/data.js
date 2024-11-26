import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

// import benefitOneImg from "../../public/img/benefit-one.png";
// import benefitTwoImg from "../../public/img/benefit-two.png";

import benefitOneImg from "../../public/images/howmuch/9.jpg";
import benefitTwoImg from "../../public/images/howmuch/10.jpg";
const benefitOne = {
  title: "特性",
  desc: "全球各个金融市场的实时数据、新闻和研究报告、强大的分析工具、即时通讯工具和世界级的交易执行系统均无缝整合于一个一体化平台。",
  image: benefitOneImg,
  bullets: [
    {
      title: "特性1",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <FaceSmileIcon />,
    },
    {
      title: "特性2",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "特性3",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "其他特性",
  desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
  image: benefitTwoImg,
  bullets: [
    {
      title: "特性1",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "特性3",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "特性3",
      desc: "跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
