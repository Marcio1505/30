import React from 'react';
import ContentLoader from 'react-content-loader';

const CashFlowLoading = (props) => (
  <ContentLoader viewBox="0 0 1200 400" height={400} width={1200} {...props}>
    <rect x="20" y="5" rx="0" ry="0" width="1" height="400" />
    <rect x="20" y="200" rx="0" ry="0" width="1200" height="1" />

    {[...Array(4)].map((_, i) => (
      <>
        <rect x={i * 320 + 40} y="75" rx="0" ry="0" width="35" height="400" />
        <rect x={i * 320 + 80} y="125" rx="0" ry="0" width="35" height="350" />
        <rect x={i * 320 + 120} y="105" rx="0" ry="0" width="35" height="270" />
        <rect x={i * 320 + 160} y="35" rx="0" ry="0" width="35" height="140" />
        <rect x={i * 320 + 200} y="55" rx="0" ry="0" width="35" height="320" />
        <rect x={i * 320 + 240} y="15" rx="0" ry="0" width="35" height="260" />
        <rect x={i * 320 + 280} y="135" rx="0" ry="0" width="35" height="10" />
        <rect x={i * 320 + 320} y="85" rx="0" ry="0" width="35" height="90" />
      </>
    ))}
  </ContentLoader>
);

CashFlowLoading.metadata = {
  name: 'CashFlowLoading',
  description: 'CashFlowLoading',
  filename: 'CashFlowLoading',
};

export default CashFlowLoading;
