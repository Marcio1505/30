import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import '../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

import moment from 'moment';

import { ChevronDown, ChevronRight, ChevronLeft } from 'react-feather';

const CustomDatePicker = ({
  label,
  filterDate,
  handleChangeFilterDate,
  onlyMonths,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('thisMonth');

  const customFlatPickr = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const nextPeriod = () => {
    let filterDates = [];
    switch (filterOption) {
      case 'yesterday':
      case 'today':
        filterDates = [
          moment(filterDate[0]).add(1, 'days').format('YYYY-MM-DD'),
          moment(filterDate[1]).add(1, 'days').format('YYYY-MM-DD'),
        ];
        break;
      case 'thisWeek':
      case 'lastWeek':
        filterDates = [
          moment(filterDate[0])
            .add(1, 'weeks')
            .startOf('week')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .add(1, 'weeks')
            .endOf('week')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'thisMonth':
      case 'lastMonth':
        filterDates = [
          moment(filterDate[0])
            .add(1, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .add(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'thisYear':
      case 'lastYear':
        filterDates = [
          moment(filterDate[0])
            .add(1, 'years')
            .startOf('year')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .add(1, 'years')
            .endOf('year')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'allTime':
        filterDates = [];
        break;
      case 'custom':
        filterDates = filterDate;
        break;
      default:
        filterDates = filterDate;
        break;
    }
    handleChangeFilterDate(filterDates);
  };

  const previousPeriod = () => {
    let filterDates = [];
    switch (filterOption) {
      case 'today':
      case 'yesterday':
        filterDates = [
          moment(filterDate[0]).subtract(1, 'days').format('YYYY-MM-DD'),
          moment(filterDate[1]).subtract(1, 'days').format('YYYY-MM-DD'),
        ];
        break;
      case 'thisWeek':
      case 'lastWeek':
        filterDates = [
          moment(filterDate[0])
            .subtract(1, 'weeks')
            .startOf('week')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .subtract(1, 'weeks')
            .endOf('week')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'thisMonth':
      case 'lastMonth':
        filterDates = [
          moment(filterDate[0])
            .subtract(1, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .subtract(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'thisYear':
      case 'lastYear':
        filterDates = [
          moment(filterDate[0])
            .subtract(1, 'years')
            .startOf('year')
            .format('YYYY-MM-DD'),
          moment(filterDate[1])
            .subtract(1, 'years')
            .endOf('year')
            .format('YYYY-MM-DD'),
        ];
        break;
      case 'allTime':
        filterDates = [];
        break;
      case 'custom':
        filterDates = filterDate;
        break;
      default:
        filterDates = filterDate;
        break;
    }
    handleChangeFilterDate(filterDates);
  };

  useEffect(() => {
    if (filterOption === 'today') {
      handleChangeFilterDate([
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'thisWeek') {
      handleChangeFilterDate([
        moment().startOf('week').format('YYYY-MM-DD'),
        moment().endOf('week').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'lastWeek') {
      handleChangeFilterDate([
        moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
        moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'thisMonth') {
      handleChangeFilterDate([
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().endOf('month').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'lastMonth') {
      handleChangeFilterDate([
        moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
        moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'thisYear') {
      handleChangeFilterDate([
        moment().startOf('year').format('YYYY-MM-DD'),
        moment().endOf('year').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'lastYear') {
      handleChangeFilterDate([
        moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
      ]);
    } else if (filterOption === 'allTime') {
      handleChangeFilterDate([]);
    } else if (filterOption === 'custom') {
      customFlatPickr.current.flatpickr.open();
    }
  }, [filterOption]);

  return (
    <>
      <FormGroup className="mb-0">
        {label && <Label for="filterDate">{label}</Label>}
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <Button
              color="primary"
              onClick={previousPeriod}
              disabled={filterOption === 'custom' || filterOption === 'allTime'}
              style={{
                padding: '1rem',
              }}
            >
              <ChevronLeft size={15} />
            </Button>
          </InputGroupAddon>
          <div className="dropdown d-flex">
            <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle color="transparent" caret>
                {filterDate[0] && filterDate[1] ? (
                  <>
                    {onlyMonths ? (
                      <span>{moment(filterDate[0]).format('MMM YYYY')}</span>
                    ) : (
                      <span>
                        {moment(filterDate[0]).format('DD/MM/YYYY')} -{' '}
                        {moment(filterDate[1]).format('DD/MM/YYYY')}
                      </span>
                    )}
                  </>
                ) : (
                  <span>Todo o Período</span>
                )}
                <ChevronDown size={15} />
              </DropdownToggle>
              <DropdownMenu>
                {!onlyMonths && (
                  <>
                    <DropdownItem
                      tag="a"
                      onClick={() => setFilterOption('today')}
                      active={filterOption === 'today'}
                    >
                      Hoje
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      onClick={() => setFilterOption('thisWeek')}
                      active={filterOption === 'thisWeek'}
                    >
                      Esta Semana
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      onClick={() => setFilterOption('lastWeek')}
                      active={filterOption === 'lastWeek'}
                    >
                      Semana Passada
                    </DropdownItem>
                  </>
                )}
                <DropdownItem
                  tag="a"
                  onClick={() => setFilterOption('thisMonth')}
                  active={filterOption === 'thisMonth'}
                >
                  Este Mês
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  onClick={() => setFilterOption('lastMonth')}
                  active={filterOption === 'lastMonth'}
                >
                  Mês Passado
                </DropdownItem>
                {!onlyMonths && (
                  <>
                    <DropdownItem
                      tag="a"
                      onClick={() => setFilterOption('thisYear')}
                      active={filterOption === 'thisYear'}
                    >
                      Este Ano
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      onClick={() => setFilterOption('lastYear')}
                      active={filterOption === 'lastYear'}
                    >
                      Ano Passado
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setFilterOption('allTime');
                      }}
                      active={filterOption === 'allTime'}
                    >
                      Todo o Período
                    </DropdownItem>
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setFilterOption('custom');
                      }}
                      active={filterOption === 'custom'}
                    >
                      Período Customizado
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </ButtonDropdown>
            <Flatpickr
              ref={customFlatPickr}
              id="filterDate"
              className="form-control custom-flatpickr"
              options={{
                mode: 'range',
                dateFormat: 'Y-m-d',
                altFormat: 'd/m/Y',
                maxRange: 31,
                altInput: true,
              }}
              value={filterDate}
              onChange={(date) => {
                if (date.length === 2) {
                  handleChangeFilterDate([
                    moment(date[0]).format('YYYY-MM-DD'),
                    moment(date[1]).format('YYYY-MM-DD'),
                  ]);
                }
              }}
            />
          </div>
          <InputGroupAddon addonType="append">
            <Button
              color="primary"
              onClick={nextPeriod}
              disabled={filterOption === 'custom' || filterOption === 'allTime'}
              style={{
                padding: '1rem',
              }}
            >
              <ChevronRight size={15} />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    </>
  );
};

CustomDatePicker.defaultProps = {
  onlyMonths: false,
  label: null,
};

CustomDatePicker.propTypes = {
  label: PropTypes.string,
  filterDate: PropTypes.array.isRequired,
  handleChangeFilterDate: PropTypes.func.isRequired,
  onlyMonths: PropTypes.bool,
};

export default CustomDatePicker;
