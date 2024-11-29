import React, { useState } from 'react';
import ScrollToTop from 'react-scroll-up';
import { Button, Spinner } from 'reactstrap';
import { MessageSquare, Loader, ArrowUp, HelpCircle } from 'react-feather';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { getChatBotSource } from '../../../utils/chatbots';

const Footer = (props) => {
  const [chatBotSource, setChatBotSource] = useState('');
  const [showChatBot, setShowChatBot] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const footerTypeArr = ['sticky', 'static', 'hidden'];
  const history = useHistory();
  const handleClickChatBot = () => {
    // window.open('https://assine.iuli.com.br/ajuda', '_blank');
    const pathName = history.location.pathname;
    const currentChatBotSource = getChatBotSource(pathName);
    setChatBotSource(currentChatBotSource);
    window.open(`http:${currentChatBotSource}`, '_blank');
    // setShowChatBot(!showChatBot);
    // if (!isIframeLoaded) {
    //   setIsIframeLoading(true);
    // }
  };
  const onIframeLoad = () => {
    setIsIframeLoaded(true);
    setIsIframeLoading(false);
  };
  return (
    <footer
      className={classnames('footer footer-light', {
        'footer-static':
          props.footerType === 'static' ||
          !footerTypeArr.includes(props.footerType),
        'd-none': props.footerType === 'hidden',
      })}
    >
      <p className="mb-0 clearfix">
        <span className="float-md-left d-block d-md-inline-block mt-25">
          COPYRIGHT © {new Date().getFullYear()}
          <a
            href="https://iuli.com.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            IULI
          </a>
          Todos direitos reservados
        </span>
      </p>
      {chatBotSource && (
        <div className={`chatbot-content ${showChatBot ? '' : 'd-none'}`}>
          <iframe src={chatBotSource} frameBorder="0" onLoad={onIframeLoad} />
        </div>
      )}
      <Button
        disabled={isIframeLoading}
        color="warning"
        className="btn-icon btn-chat-bot rounded-circle scroll-top"
        onClick={handleClickChatBot}
      >
        {isIframeLoading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            color="white"
          />
        ) : (
          <MessageSquare size={15} />
        )}
      </Button>
      {/* {props.hideScrollToTop === false ? (
        <ScrollToTop showUnder={160}>
          <Button color="primary" className="btn-icon scroll-top">
            <ArrowUp size={15} />
          </Button>
        </ScrollToTop>
      ) : null} */}
    </footer>
  );
};

export default Footer;
