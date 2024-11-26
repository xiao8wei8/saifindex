import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";
const App =  () =>{
  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="SAIF AI-BASE Benefits"
        title=" 你为什么要使用这个SAIF AI-BASE"
      >
        SAIF AI-BASE 全球各个金融市场的实时数据、新闻和研究报告、强大的分析工具、即时通讯工具和世界级的交易执行系统均无缝整合于一个一体化平台。
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="Watch a video"
        title="学会如何满足自己的需求"
      >
       跨资产类别的订单和执行管理解决方案及满足买方和卖方机构全部投资流程的分析工具，使他们与全球资本市场对接、提升企业合规并降低所有者成本。
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Testimonials"
        title="这是我们的顾客说的"
      >
      由市场、场内工具和机构变化而不断筛选、认证和持续更新的最优质的数据。
      </SectionTitle>

      <Testimonials />

      {/* <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle> */}

      <Faq />
      <Cta />
    </Container>
  );
}
export default App