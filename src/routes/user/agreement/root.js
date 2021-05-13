import React from 'react'
import { connect } from 'dva'
import style from './agreement.less'

function Agreement() {
  return (
    <div className={style.agreement}>
      <section className={style.section1}>
        <p>
          为使用华图在线的服务，您应当阅读并遵守《用户服务协议》（以下简称“本协议”）。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款。除非您已阅读并接受本协议所有条款，否则您无权使用华图在线提供的服务。您使用华图在线的服务即视为您已阅读并同意本协议的约束。
        </p>
      </section>
      <section>
        <h1>一、【协议的范围】</h1>
        <p>
          本协议是用户为使用华图在线相关服务与华图在线经营者北京华图宏阳网络科技有限公司所订立的协议。华图在线网站包括但不限于华图在线平台（http://v.huatu.com/）及网站相应移动app（华图在线）等。“用户”是指使用华图在线相关服务的使用人，在本协议中更多地称为“您”。在本协议中北京华图宏阳网络科技有限公司也被称为“华图在线”。
        </p>
      </section>
      <section>
        <h1>二、【帐号与密码安全】</h1>
        <p>2.1您在使用华图在线的服务时需要注册一个帐号。</p>
        <p>
          2.2华图在线特别提醒您应妥善保管您的帐号和密码。当您使用完毕后，应安全退出。因您保管不善或与第三人分享账户导致遭受盗号或密码失窃的，责任由您自行承担。
        </p>
        <p>
          2.3华图在线建议您使用的密码应至少包含以下四类字符中的三类：大写字母、小写字母、数字，以及键盘上的特殊符号，如果因为您设置的密码过于简单导致遭受盗号或密码失窃，责任由您自行承担。对于非因华图在线所导致的任何账号安全、隐私保护等问题及非因华图在线给各方造成的损失，均与华图在线无关。
        </p>
      </section>
      <section>
        <h1>三、【用户个人信息保护】</h1>
        <p>3.1保护用户个人信息是华图在线的一项基本原则。</p>
        <p>
          3.2您在注册帐号或使用本服务的过程中，需要按照要求填写必要的信息。若国家法律法规有特殊规定需要填写真实身份信息的，若您填写的信息不完整，则无法使用本服务或在使用过程中受到限制。
        </p>
        <p>
          3.3一般情况下，您可随时浏览、修改自己提交的信息，但出于安全性和身份识别（如号码申诉服务）的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
        </p>
        <p>
          3.4华图在线将运用各种安全技术和程序建立完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。
        </p>
        <p>
          3.5未经您的同意，华图在线不会向华图在线以外的任何公司、组织和个人披露您的个人信息，但法律法规另有规定的除外。
        </p>
        <div>
          3.6华图在线保证不对外公开或向第三方披露或提供用户注册资料及用户在使用网络服务时存储在华图在线平台、服务器或数据库的非公开内容和信息，但下列情况除外：
          <p>（1） 事先获得用户的明确授权；</p>
          <p>（2） 按照相关政府主管部门和司法机关的要求；</p>
          <p>（3） 为维护社会公众的利益；</p>
          <p>（4） 为维护华图在线的合法权益；</p>
          <p>（5） 法律规定的其他情形。</p>
        </div>
      </section>
      <section>
        <h1>四、【使用本服务的方式】</h1>
        <p>4.1使用方式</p>
        <p>
          a.除非您与华图在线另有约定，您同意华图在线的服务仅供个人交流、学习欣赏，非商业性质的使用，您不可对本服务任何部分的任何信息进行复制、拷贝、出售、或利用本服务进行调查、广告、或用于其他商业目的。
        </p>
        <p>
          b.您应当通过华图在线提供或认可的方式使用本服务。您依本协议条款所取得的权利不可转让。
        </p>
        <p>
          c.您不得使用未经华图在线授权的插件、外挂或第三方工具对本协议项下的服务进行干扰、破坏、修改或施加其他影响。
        </p>
        <p>
          d.
          您需保证在使用华图在线发布、传播的信息的真实性、准确性，同时保证该等信息不侵犯任何第三方的知识产权。
        </p>
        <p>
          4.2违反以上约定视为您的严重违约，华图在线有权在不通知您的情况下，中止对您的服务，解除双方间的服务协议和法律关系，且无需退还您所支付的费用，如该费用不足以弥补华图在线的损失的，华图在线还可通过其他法律途径向您追索。
        </p>
      </section>
      <section>
        <h1>五、【按现状提供服务】</h1>
        <p>
          您理解并同意，华图在线的服务是按照现有技术和条件所能达到的现状提供的。华图在线会尽最大努力向您提供服务，确保服务的连贯性和安全性；但华图在线不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。
        </p>
      </section>
      <section>
        <h1>六、【自备设备】</h1>
        <p>
          6.1您应当理解，您使用华图在线的服务需自行准备与相关服务有关的终端设备（如电脑、调制解调器等装置），并承担所需的费用（如电话费、上网费等费用）。
        </p>
        <p>6.2您理解并同意，您使用本服务时会耗用您的终端设备和带宽等资源。</p>
      </section>

      <section>
        <h1>七、【广告】</h1>
        <p>
          7.1您同意华图在线可以在提供服务的过程中自行或由第三方广告商向您发送广告、推广或宣传信息（包括商业与非商业信息），其方式和范围可不经向您特别通知而变更。
        </p>
        <p>
          7.2华图在线依照法律的规定对广告商履行相关义务，您应当自行判断广告信息的真实性并为自己的判断行为负责，除法律明确规定外，您因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，华图在线不承担责任。
        </p>
        <p>
          7.3您同意，所有对您收取费用的服务或功能，均不能免除您接受华图在线所提供的广告。因为这是华图在线为所有用户提供综合服务的有效对价，您阅读本协议即视为对该规则的理解和接受。
        </p>
      </section>
      <section>
        <h1>八、【收费服务】</h1>

        <p>
          8.1华图在线的部分服务是以收费方式提供的，如您使用收费服务，请遵守相关的协议。华图在线会在相关页面上做出提示，如果您拒绝支付该等费用，则不能使用相关的网络服务。
        </p>

        <p>
          8.2华图在线将有权决定华图在线所提供的服务的资费标准和收费方式，华图在线有权就不同的服务或服务的不同阶段制定不同的资费标准和收费方式。
        </p>
        <p>
          8.3华图在线有权根据实际需要对收费服务的收费标准、方式进行修改和变更，华图在线也有权对部分免费服务开始收费。前述修改、变更或开始收费前，华图在线将在相应服务页面进行通知或公告。如果您不同意上述修改、变更或付费内容，则应停止使用该服务。如未停止使用该服务，则视为对上述修改、变更或付费内容的认可。
        </p>
      </section>
      <section>
        <h1>九、【收益功能】</h1>
        <p>
          如果您在华图在线使用任何产品功能（包括但不限于：做题、视频学习、分享等），则表明您愿意接受本网站提供给您的各类奖励或网站虚拟服务或产品奖励。如果您拒绝接受该等奖励，视为您不接受本协议内容和规则，则不能使用任何本网站相关服务和功能，本网站为保障其他用户正常使用网站服务和各项功能，除有权限制您上述功能和服务外，还有权中止或解除双方间的服务协议和法律关系。
        </p>
      </section>
      <section>
        <h1>十、【第三方提供的产品或服务】</h1>
        <p>
          您在华图在线平台上使用第三方提供的产品或服务时，除遵守本协议约定外，还应遵守第三方的用户协议。华图在线和第三方对可能出现的纠纷在法律规定和约定的范围内各自承担责任。
        </p>
      </section>
      <section>
        <h1>十一、【本服务中的软件】</h1>
        <p>
          11.1您在使用本服务的过程中可能需要下载软件，对于这些软件，华图在线给予您一项个人的、不可转让及非排他性的许可。您仅可为访问或使用本服务的目的而使用这些软件。
        </p>
        <p>
          11.2为了改善用户体验、保证服务的安全性及产品功能的一致性，华图在线有权对软件进行更新。您应该将相关软件更新到最新版本，否则华图在线并不保证其能正常使用。因您未能及时更新软件造成损失的，与华图在线无关。
        </p>
      </section>
      <section>
        <h1>十二、【知识产权声明】</h1>
        <p>
          12.1华图在线在本服务中所使用的商业标识，其著作权或商标权归华图在线所有。
        </p>
        <p>
          12.2华图在线所提供的服务与服务有关的全部信息、资料、文字、软件、声音、图片、视频、图表（包括相关的软件）的著作权、商标权等知识产权所有权及其他权利，均为华图在线所有。未经授权，您不得对任何该信息、资料、文字、软件、声音、图片、视频、图表进行修改、拷贝、散布、传送、展示、执行、复制、发行、授权、制作衍生著作、移转或销售。如您未遵守本条款的上述规定，视为对华图在线的侵权，华图在线有权无需通知立即终止为您提供服务，解除双方间的服务协议和法律关系，且无需退还您所支付的费用，如该费用不足以弥补华图在线的损失的，华图在线还可通过其他法律途径向您追索。同时您必须销毁任何已经获得的上述信息、资料、文字、软件、声音、图片、视频、图表等。
        </p>
        <p>
          12.3您不得对华图在线软件及相关附属组件，华图在线网站相关网页、应用等产品进行反向工程、反向汇编、反向编译等。
        </p>
      </section>
      <section>
        <h1>十三、【用户违法行为】</h1>
        <p>
          13.1您在使用本服务时须遵守法律法规，不得利用本服务从事违法违规行为，包括但不限于：
        </p>

        <p>（1）反对宪法所确定的基本原则的；</p>

        <p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>

        <p>（3）损害国家荣誉和利益的；</p>

        <p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>

        <p>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>

        <p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>

        <p>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>

        <p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p>
        <p>
          （9）发布、传送、传播、储存侵害他人知识产权、商业秘密等合法权利的内容；
        </p>
        <p>（10）其他法律法、行政法规禁止的行为。</p>
        <p>
          13.2如果您违反了本条约定导致华图在线受到相关国家机关或机构提起的诉讼、罚款或采取其他制裁措施的，华图在线有权立即停止提供服务，并解除协议，同时有权向您追偿华图在线受到的损失及为维护自己权益产生的一切费用（该费用包括不限于诉讼费、差旅费、律师费、保全费等等）。
        </p>

        <p>
          13.3如果华图在线发现或收到他人举报您发布的信息违反本条约定、违反国家法律法规或侵犯他人合法权益，华图在线有权进行独立判断并采取技术手段予以删除、屏蔽或断开链接。同时，华图在线有权视用户的行为性质，采取包括但不限于暂停或终止服务，限制、冻结或终止账号使用，追究法律责任等措施。
        </p>

        <p>
          13.4您违反本条约定，导致任何第三方损害的，您应当独立承担责任；华图在线因此遭受损失的，您也应当一并赔偿。
        </p>

        <p>
          13.5违反本条约定，视为您的严重违约，华图在线可以中止对您的服务，解除双方间的服务协议和法律关系，且无需退还您所支付的费用，如该费用不足以弥补华图在线的损失的，华图在线还可通过其他法律途径向您追索。
        </p>
      </section>
      <section>
        <h1> 十四、【遵守当地法律监管】</h1>

        <p>
          14.1您在使用本服务过程中应当遵守当地相关的法律法规，并尊重当地的道德和风俗习惯。如果您的行为违反了当地法律法规或道德风俗，您应当为此独立承担责任。
        </p>

        <p>
          14.2您应避免因使用本服务而使华图在线卷入政治和公共事件，否则华图在线有权暂停或终止对您的服务。
        </p>

        <p>
          14.3违反本条约定，视为您的严重违约，华图在线可以中止对您的服务，解除双方间的服务协议和法律关系，且无需退还您所支付的费用，如该费用不足以弥补华图在线的损失的，华图在线还可通过其他法律途径向您追索。
        </p>
      </section>
      <section>
        <h1>十五、【用户发送、传播的内容与第三方投诉处理】</h1>

        <p>
          15.1您通过本服务发送或传播的内容（包括但不限于网页、文字、图片、音频、视频、图表等）均由您自行承担责任。
        </p>

        <p>
          15.2您发送或传播的内容应有合法来源，相关内容为您所有或您已获得权利人的授权。
        </p>

        <p>
          15.3您同意华图在线可为履行本协议或提供本服务的目的而使用您发送或传播的内容。
        </p>

        <p>
          15.4如果华图在线收到权利人通知，主张您发送或传播的内容侵犯其相关权利的，您同意华图在线有权进行独立判断并采取删除、屏蔽或断开链接等措施。
        </p>
      </section>
      <section>
        <h1>十六、【不可抗力及其他免责事由】</h1>

        <p>
          16.1您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，华图在线将努力在第一时间与相关单位配合，及时进行修复，但是由此给您造成的损失华图在线在法律允许的范围内免责。
        </p>

        <p>
          16.2在法律允许的范围内，华图在线对以下情形导致的服务中断或受阻不承担责任：
        </p>

        <p>（1）受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</p>

        <p>（2）用户或华图在线的电脑软件、系统、硬件和通信线路出现故障；</p>
        <p>
          （3）用户操作不当或用户将用户密码告知他人或与他人共享注册帐户，由此导致的任何个人信息的泄漏，或其他非因华多公司原因导致的个人信息的泄漏
        </p>
        <p>（4）用户通过非华图在线授权的方式使用本服务；</p>
        <p>（5）其他华图在线无法控制或合理预见的情形。</p>

        <p>
          16.3您理解并同意，在使用本服务的过程中，可能会遇到网络信息或其他用户行为带来的风险，华图在线不对任何信息的真实性、适用性、合法性承担责任，也不对因侵权行为给您造成的损害负责。这些风险包括但不限于：
        </p>

        <p>
          （1）来自他人匿名或冒名的含有威胁、诽谤、令人反感或非法内容的信息；
        </p>

        <p>
          （2）因使用本协议项下的服务，遭受他人误导、欺骗或其他导致或可能导致的任何心理、生理上的伤害以及经济上的损失；
        </p>

        <p>（3）其他因网络信息或用户行为引起的风险。</p>

        <p>
          16.4您理解并同意，本服务并非为某些特定目的而设计，包括但不限于核设施、军事用途、医疗设施、交通通讯等重要领域。如果因为软件或服务的原因导致上述操作失败而带来的人员伤亡、财产损失和环境破坏等，华图在线不承担法律责任。
        </p>

        <p>
          16.5华图在线依据本协议约定获得处理违法违规内容的权利，该权利不构成华图在线的义务或承诺，华图在线不能保证及时发现违法行为或进行相应处理。
        </p>

        <p>
          16.6在任何情况下，您不应轻信借款、索要密码或其他涉及财产的网络信息。涉及财产操作的，请一定先核实对方身份，并请经常留意华图在线有关防范诈骗犯罪的提示。
        </p>
      </section>
      <section>
        <h1>十七、【协议的生效与变更】</h1>

        <p>17.1您使用华图在线的服务即视为您已阅读本协议并接受本协议的约束。</p>

        <p>
          17.2华图在线有权在必要时修改本协议条款。您可以在相关服务页面查阅最新版本的协议条款。
        </p>

        <p>
          17.3本协议条款变更后，如果您继续使用华图在线提供的软件或服务，即视为您已接受修改后的协议。如果您不接受修改后的协议，应当停止使用华图在线提供的软件或服务。
        </p>
      </section>
      <section>
        <h1>十八、【服务的变更、中断、终止】</h1>

        <p>
          18.1华图在线可能会对服务内容进行变更，也可能会中断、中止或终止服务。
        </p>

        <p>
          18.2如发生下列任何一种情形，华图在线有权不经通知而中断或终止向您提供的服务：
        </p>

        <p>
          （1）根据法律规定您应提交真实信息，而您提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明；
        </p>

        <p>（2）您违反相关法律法规或本协议的约定；</p>

        <p>（3）按照法律规定或主管部门的要求；</p>

        <p>（4）出于安全的原因或其他必要的情形。</p>
      </section>
      <section>
        <h1>十九、【管辖与法律适用】</h1>

        <p>19.1本协议签订地为中华人民共和国北京市海淀区。</p>

        <p>
          19.2本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。
        </p>

        <p>
          19.3若您和华图在线之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。
        </p>

        <p>
          19.4本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
        </p>

        <p>
          19.5本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
        </p>
      </section>
      <section>
        <h1>二十、【其他】</h1>

        <p>
          如果您对本协议或本服务有意见或建议，可与华图在线网站客服专区联系（http://v.huatu.com/），我们会给予您必要的帮助。
        </p>
      </section>
    </div>
  )
}

export default connect()(Agreement)