import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { ChevronLeft, ChevronRight, Plus } from 'react-feather';
import { PeriodClosureSidebar } from './PeriodClosureSidebar';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { fetchPeriodClosuresList } from '../../../../services/apis/period_closure.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../../assets/scss/plugins/calendars/react-big-calendar.scss';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);
const eventColors = {
  Period: 'bg-success',
  Cash: 'bg-warning',
};

const Toolbar = ({ label, onNavigate, setShowSidebar }) => (
  <div className="calendar-header mb-2 d-flex justify-content-between flex-wrap">
    <div>
      <Button.Ripple
        color="primary"
        onClick={() => {
          setShowSidebar(true);
        }}
        className="d-sm-block d-none"
      >
        {' '}
        <Plus size={15} />{' '}
        <span className="align-middle">Encerrar/Reabrir Período</span>
      </Button.Ripple>
    </div>
    <div className="month-label d-flex flex-column text-center text-md-right mt-1 mt-md-0">
      <div className="calendar-navigation">
        <Button.Ripple
          className="btn-icon rounded-circle"
          size="sm"
          color="primary"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft size={15} />
        </Button.Ripple>
        <div className="month d-inline-block mx-75 text-bold-500 font-medium-2 align-middle">
          {label}
        </div>
        <Button.Ripple
          className="btn-icon rounded-circle"
          size="sm"
          color="primary"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight size={15} />
        </Button.Ripple>
      </div>
    </div>
  </div>
);

function PeriodClosureList() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [events, setEvents] = useState([]);
  const [bankAccountOptions, setBankAccountOptions] = useState([]);
  const [range, setRange] = useState({});

  const handleEventColors = (event) => ({
    className: eventColors[event.label],
  });

  const getPeriodClosuresList = async ({ dateStart, dateEnd } = {}) => {
    const closureDateStart =
      dateStart || moment().startOf('month').format('YYYY-MM-DD');
    const closureDateEnd =
      dateEnd || moment().endOf('month').format('YYYY-MM-DD');
    fetchPeriodClosuresList({
      params: `closure_date_start=${closureDateStart}&closure_date_end=${closureDateEnd}`,
    }).then((response) => {
      const respPeriodClosures = response.data.map((periodClosure) => ({
        id: periodClosure.id,
        title: `${periodClosure.type === 'Cash' ? 'DFC' : 'DRE'} - ${
          periodClosure.bank_account_id
        }`,
        start: moment(periodClosure.closure_date).toDate(),
        end: moment(periodClosure.closure_date).toDate(),
        label: periodClosure.type,
        allDay: true,
        selectable: false,
      }));
      setEvents(respPeriodClosures);
    });
  };

  const getBankAccounts = async () => {
    const respBankAccountList = await fetchBankAccountsList();
    const dataBankAccounts = respBankAccountList.data || [];
    setBankAccountOptions(
      dataBankAccounts.map((bankAccount) => ({
        ...bankAccount,
        label: bankAccount.name,
        value: bankAccount.id,
      }))
    );
  };

  const handleRangeChange = (newRange) => {
    setRange({
      dateStart: moment(newRange.start).format('YYYY-MM-DD'),
      dateEnd: moment(newRange.end).format('YYYY-MM-DD'),
    });
  };

  const handlePeriodList = () => {
    getPeriodClosuresList(range);
  };

  useEffect(() => {
    Promise.all([getBankAccounts()]);
  }, []);

  useEffect(() => {
    getPeriodClosuresList(range);
  }, [range]);

  return (
    <Row className="period-closure-list">
      <Col md="12" sm="12">
        <Breadcrumbs
          breadCrumbTitle={<FormattedMessage id="period_closure" />}
          breadCrumbActive={<FormattedMessage id="period_closure.list" />}
        />
      </Col>
      <Col md="12" sm="12">
        <div className="app-calendar position-relative">
          <Card>
            <CardBody>
              <DragAndDropCalendar
                localizer={localizer}
                events={events}
                onRangeChange={(newRange) => handleRangeChange(newRange)}
                showAllEvents
                startAccessor="start"
                endAccessor="end"
                resourceAccessor="url"
                views={['month']}
                components={{
                  toolbar: (props) => (
                    <Toolbar
                      label={props.label}
                      onNavigate={props.onNavigate}
                      setShowSidebar={setShowSidebar}
                    />
                  ),
                }}
                eventPropGetter={handleEventColors}
                popup
                selectable
              />
            </CardBody>
          </Card>
          <PeriodClosureSidebar
            bankAccountOptions={bankAccountOptions}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            handlePeriodList={handlePeriodList}
          />
        </div>
      </Col>
    </Row>
  );
}

export default PeriodClosureList;
