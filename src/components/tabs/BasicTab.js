import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

const BasicTab = ({ tabs, title }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const toggle = (newActiveTab) => {
    if (activeTab !== newActiveTab) {
      setActiveTab(newActiveTab);
    }
  };

  useEffect(() => {
    setActiveTab(tabs[0]?.id);
  }, [tabs]);

  return (
    <>
      <Nav tabs>
        <li className="mr-auto d-flex nav-link align-items-center">
          {/* <div className={`mr-1 avatar card-${statusStyle}`}>
            <span className="avatar-content" />
          </div> */}
          {title}
        </li>
        <NavItem className="d-flex">
          {tabs.map((tab) => (
            <NavLink
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => {
                toggle(tab.id);
              }}
              key={tab.id}
            >
              {tab.name}
            </NavLink>
          ))}
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} className="p-1">
        {tabs.map((tab) => (
          <TabPane key={tab.id} tabId={tab.id}>
            {tab.content}
          </TabPane>
        ))}
      </TabContent>
    </>
  );
};

BasicTab.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default BasicTab;
