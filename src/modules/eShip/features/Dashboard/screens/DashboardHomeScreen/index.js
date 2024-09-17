import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CardAreaChart from '../../components/CardAreaChart';
import {
  thunkGetScannedOrderStatisticByDate,
  thunkGetStatisticByDate,
  thunkGetStatisticByEmployee,
  thunkGetStatisticByPostOffice,
  thunkGetStatisticThisMonth,
} from '../../dashboardSlice';
import Global from 'general/utils/Global';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { unwrapResult } from '@reduxjs/toolkit';
import Utils from 'general/utils/Utils';
import CardStat from '../../components/CardStat';
import DateRangePickerInput from 'general/components/Form/DateRangePicker';
import moment from 'moment';
import CardBarChart from '../../components/CardBarChart';
import _ from 'lodash';

DashboardHomeScreen.propTypes = {};

const sTag = '[DashboardHomeScreen]';

function DashboardHomeScreen(props) {
  // MARK: ---- Params ----
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    statisticByDate,
    isGettingStatisticByDate,

    scannedOrderStatisticByDate,
    isGettingScannedOrderStatisticByDate,

    isGettingStatisticThisMonth,
    thisMonthStatistic,

    statisticByEmployee,
    isGettingStatisticByEmployee,

    statisticByPostOffice,
    isGettingStatisticByPostOffice,
  } = useSelector((state) => state?.dashboard);

  const refHandedOverStatisticLoading = useRef(false);
  const needToRefreshHandedOverStatistic = useRef(statisticByDate.length === 0);
  const [handedOverFilter, setHandedOverFilter] = useState(Global.gFiltersHandedOverStatistic);

  const refScannedStatisticLoading = useRef(false);
  const needToRefreshScannedStatistic = useRef(scannedOrderStatisticByDate.length === 0);
  const [ScannedFilter, setScannedFilter] = useState(Global.gFiltersScannedStatistic);

  const refOrderByEmployeeStatisticLoading = useRef(false);
  const needToRefreshOrderByEmployeeStatistic = useRef(statisticByEmployee.length === 0);
  const [orderByEmployeeFilter, setOrderByEmployeeFilter] = useState(
    Global.gFiltersOrderByEmployeeStatistic
  );

  const refOrderByPostOfficeStatisticLoading = useRef(false);
  const needToRefreshOrderByPostOfficeStatistic = useRef(statisticByPostOffice.length === 0);
  const [orderByPostOfficeFilter, setOrderByPostOfficeFilter] = useState(
    Global.gFiltersOrderByPostOfficeStatistic
  );

  // MARK: ---- Functions ----
  async function getHandedOverStatistic() {
    refHandedOverStatisticLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetStatisticByDate(handedOverFilter)));
    } catch (error) {
      console.log(`${sTag} get handed over order statistic error: ${error.message}`);
    }
    refHandedOverStatisticLoading.current = false;
  }

  async function getScannedStatistic() {
    refScannedStatisticLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetScannedOrderStatisticByDate(ScannedFilter)));
    } catch (error) {
      console.log(`${sTag} get scanned order statistic error: ${error.message}`);
    }
    refScannedStatisticLoading.current = false;
  }

  async function getOrderByEmployeeStatistic() {
    refOrderByEmployeeStatisticLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetStatisticByEmployee(orderByEmployeeFilter)));
    } catch (error) {
      console.log(`${sTag} get order by employee statistic error: ${error.message}`);
    }
    refOrderByEmployeeStatisticLoading.current = false;
  }

  async function getOrderByPostOfficeStatistic() {
    refOrderByPostOfficeStatisticLoading.current = true;
    try {
      const res = unwrapResult(
        await dispatch(thunkGetStatisticByPostOffice(orderByPostOfficeFilter))
      );
    } catch (error) {
      console.log(`${sTag} get order by employee statistic error: ${error.message}`);
    }
    refOrderByPostOfficeStatisticLoading.current = false;
  }

  // MARK: ---- Hooks ----
  useEffect(() => {
    if (
      !refHandedOverStatisticLoading.current &&
      (needToRefreshHandedOverStatistic.current || Global.gNeedToRefreshHandedOverStatistic)
    ) {
      getHandedOverStatistic();
      Global.gNeedToRefreshHandedOverStatistic = false;
    }
  }, [handedOverFilter]);

  useEffect(() => {
    if (
      !refScannedStatisticLoading.current &&
      (needToRefreshScannedStatistic.current || Global.gNeedToRefreshScannedStatistic)
    ) {
      getScannedStatistic();
      Global.gNeedToRefreshScannedStatistic = false;
    }
  }, [ScannedFilter]);

  useEffect(() => {
    if (
      !refOrderByEmployeeStatisticLoading.current &&
      (needToRefreshOrderByEmployeeStatistic.current ||
        Global.gNeedToRefreshOrderByEmployeeStatistic)
    ) {
      getOrderByEmployeeStatistic();
      Global.gNeedToRefreshOrderByEmployeeStatistic = false;
    }
  }, [orderByEmployeeFilter]);

  useEffect(() => {
    if (
      !refOrderByPostOfficeStatisticLoading.current &&
      (needToRefreshOrderByPostOfficeStatistic.current ||
        Global.gNeedToRefreshOrderByPostOfficeStatistic)
    ) {
      getOrderByPostOfficeStatistic();
      Global.gNeedToRefreshOrderByPostOfficeStatistic = false;
    }
  }, [orderByPostOfficeFilter]);

  useEffect(() => {
    dispatch(thunkGetStatisticThisMonth());
  }, []);

  return (
    <div>
      <h1>{`${t('TotalOrderThisMonth')}: ${Utils.formatNumber(
        thisMonthStatistic?.total?.thisMonth
      )}`}</h1>
      <h4 className="mb-8">
        <i
          className={`fa-regular fa-arrow-trend-${
            thisMonthStatistic?.total?.growth > 0 ? 'up' : 'down'
          } fa-lg`}
          style={{ color: thisMonthStatistic?.total?.growth > 0 ? '#00b69b' : '#F93C65' }}
        ></i>
        <span
          style={{ color: thisMonthStatistic?.total?.growth > 0 ? '#00b69b' : '#F93C65' }}
        >{` ${Utils.formatNumber(
          thisMonthStatistic?.total?.growth > 0
            ? thisMonthStatistic?.total?.growth
            : thisMonthStatistic?.total?.growth * -1
        )}%`}</span>
        <span style={{ color: Utils.hexToRGBA('#202224', 0.7) }} className="text-lowercase">{` ${
          thisMonthStatistic?.total?.growth > 0 ? t('UpLastMonth') : t('DownLastMonth')
        }`}</span>
      </h4>
      <div className="row">
        <div className="col-lg-3 col-md-6 mb-8">
          <CardStat
            icon={
              <i
                className="fa-duotone fa-box fa-2xl"
                style={{ '--fa-primary-color': '#00b505', '--fa-secondary-color': '#00b505' }}
              ></i>
            }
            iconColor="#00b505"
            label={t('ReadyToShip')}
            growth={thisMonthStatistic?.readyToShip?.growth}
            value={thisMonthStatistic?.readyToShip?.thisMonth}
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-8">
          <CardStat
            icon={
              <i
                className="fa-duotone fa-box-circle-check fa-2xl"
                style={{ '--fa-primary-color': '#3388EC', '--fa-secondary-color': '#3388EC' }}
              ></i>
            }
            iconColor="#3388EC"
            label={t('Transporting')}
            growth={thisMonthStatistic?.handedOver?.growth}
            value={thisMonthStatistic?.handedOver?.thisMonth}
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-8">
          <CardStat
            icon={
              <i
                className="fa-regular fa-arrow-rotate-left fa-2xl"
                style={{ color: '#ffb700' }}
              ></i>
            }
            iconColor="#ffb700"
            label={t('Returned')}
            growth={thisMonthStatistic?.returned?.growth}
            value={thisMonthStatistic?.returned?.thisMonth}
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-8">
          <CardStat
            icon={
              <i className="fa-regular fa-rectangle-xmark fa-2xl" style={{ color: '#ec3b31' }}></i>
            }
            iconColor="#EC3B31"
            label={t('Cancelled')}
            growth={thisMonthStatistic?.cancelled?.growth}
            value={thisMonthStatistic?.cancelled?.thisMonth}
          />
        </div>
      </div>
      <div className="row mb-8">
        <div className="col-lg-6">
          <CardAreaChart
            fill={false}
            additionalClassName=""
            fullChartLabels={statisticByDate?.map((item) => item.label)}
            loading={isGettingStatisticByDate}
            title={_.capitalize(t('HandedOverOrder'))}
            chartLabels={statisticByDate?.map((item) => Utils.formatDateTime(item.label, 'DD/MM'))}
            chartSeries={[
              {
                name: t('Order'),
                data: statisticByDate?.map((item) => item.value),
              },
            ]}
            chartColors={['#FF7B00']}
            headerSidebar={
              <div>
                <DateRangePickerInput
                  className=""
                  initialLabel="7 ngày gần đây"
                  initialEndDate={moment()}
                  initialStartDate={moment().subtract(6, 'days')}
                  getDateRange={(dateRange) => {
                    needToRefreshHandedOverStatistic.current = true;
                    switch (dateRange.label) {
                      case 'Tất cả':
                        setHandedOverFilter({
                          ...handedOverFilter,
                          from: '',
                          to: '',
                        });
                        break;
                      default:
                        setHandedOverFilter({
                          ...handedOverFilter,
                          from: dateRange.startDate.toISOString(),
                          to: dateRange.endDate.toISOString(),
                        });
                    }
                  }}
                  customRange={{
                    // 'Hôm qua': [
                    //   moment().subtract(1, 'day').startOf('day'),
                    //   moment().subtract(1, 'day').endOf('day'),
                    // ],
                    'Tuần này': [moment().startOf('week'), moment()],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng trước': [
                      moment().subtract(1, 'month').startOf('month'),
                      moment().subtract(1, 'month').endOf('month'),
                    ],
                    'Tháng này': [moment().startOf('month'), moment()],
                  }}
                />
              </div>
            }
          />
        </div>
        <div className="col-lg-6 mt-8 mt-lg-0">
          <CardAreaChart
            fill={false}
            additionalClassName=""
            fullChartLabels={scannedOrderStatisticByDate?.map((item) => item.label)}
            loading={isGettingScannedOrderStatisticByDate}
            title={_.capitalize(t('TotalOrder'))}
            chartLabels={scannedOrderStatisticByDate?.map((item) =>
              Utils.formatDateTime(item.label, 'DD/MM')
            )}
            chartSeries={[
              {
                name: t('Order'),
                data: scannedOrderStatisticByDate?.map((item) => item.value),
              },
            ]}
            chartColors={['#5ac8fa']}
            headerSidebar={
              <div>
                <DateRangePickerInput
                  className=""
                  initialLabel="7 ngày gần đây"
                  initialEndDate={moment()}
                  initialStartDate={moment().subtract(6, 'days')}
                  getDateRange={(dateRange) => {
                    needToRefreshScannedStatistic.current = true;
                    switch (dateRange.label) {
                      case 'Tất cả':
                        setScannedFilter({
                          ...ScannedFilter,
                          from: '',
                          to: '',
                        });
                        break;
                      default:
                        setScannedFilter({
                          ...ScannedFilter,
                          from: dateRange.startDate.toISOString(),
                          to: dateRange.endDate.toISOString(),
                        });
                    }
                  }}
                  customRange={{
                    // 'Hôm qua': [
                    //   moment().subtract(1, 'day').startOf('day'),
                    //   moment().subtract(1, 'day').endOf('day'),
                    // ],
                    'Tuần này': [moment().startOf('week'), moment()],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng trước': [
                      moment().subtract(1, 'month').startOf('month'),
                      moment().subtract(1, 'month').endOf('month'),
                    ],
                    'Tháng này': [moment().startOf('month'), moment()],
                  }}
                />
              </div>
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <CardBarChart
            loading={isGettingStatisticByEmployee}
            title={t('OrderByEmployee')}
            chartColors={[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
              .reverse()
              .map((item) => Utils.blurColor('#74D7A7', item))}
            chartSeries={statisticByEmployee.map((item) => item.value)}
            chartLabels={statisticByEmployee.map((item) => item.label)}
            headerSidebar={
              <div>
                <DateRangePickerInput
                  className=""
                  initialLabel="7 ngày gần đây"
                  initialEndDate={moment()}
                  initialStartDate={moment().subtract(6, 'days')}
                  getDateRange={(dateRange) => {
                    needToRefreshOrderByEmployeeStatistic.current = true;
                    switch (dateRange.label) {
                      case 'Tất cả':
                        setOrderByEmployeeFilter({
                          ...orderByEmployeeFilter,
                          from: '',
                          to: '',
                        });
                        break;
                      default:
                        setOrderByEmployeeFilter({
                          ...orderByEmployeeFilter,
                          from: dateRange.startDate.toISOString(),
                          to: dateRange.endDate.toISOString(),
                        });
                    }
                  }}
                  customRange={{
                    // 'Hôm qua': [
                    //   moment().subtract(1, 'day').startOf('day'),
                    //   moment().subtract(1, 'day').endOf('day'),
                    // ],
                    'Tuần này': [moment().startOf('week'), moment()],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng trước': [
                      moment().subtract(1, 'month').startOf('month'),
                      moment().subtract(1, 'month').endOf('month'),
                    ],
                    'Tháng này': [moment().startOf('month'), moment()],
                  }}
                />
              </div>
            }
          />
        </div>
        <div className="col-md-6">
          <CardBarChart
            loading={isGettingStatisticByPostOffice}
            title={t('OrderByPostOffice')}
            chartColors={[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
              .reverse()
              .map((item) => Utils.blurColor('#ffcc00', item))}
            chartSeries={statisticByPostOffice.map((item) => item.value)}
            chartLabels={statisticByPostOffice.map((item) => item.label)}
            headerSidebar={
              <div>
                <DateRangePickerInput
                  className=""
                  initialLabel="7 ngày gần đây"
                  initialEndDate={moment()}
                  initialStartDate={moment().subtract(6, 'days')}
                  getDateRange={(dateRange) => {
                    needToRefreshOrderByPostOfficeStatistic.current = true;
                    switch (dateRange.label) {
                      case 'Tất cả':
                        setOrderByPostOfficeFilter({
                          ...orderByPostOfficeFilter,
                          from: '',
                          to: '',
                        });
                        break;
                      default:
                        setOrderByPostOfficeFilter({
                          ...orderByPostOfficeFilter,
                          from: dateRange.startDate.toISOString(),
                          to: dateRange.endDate.toISOString(),
                        });
                    }
                  }}
                  customRange={{
                    // 'Hôm qua': [
                    //   moment().subtract(1, 'day').startOf('day'),
                    //   moment().subtract(1, 'day').endOf('day'),
                    // ],
                    'Tuần này': [moment().startOf('week'), moment()],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng trước': [
                      moment().subtract(1, 'month').startOf('month'),
                      moment().subtract(1, 'month').endOf('month'),
                    ],
                    'Tháng này': [moment().startOf('month'), moment()],
                  }}
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardHomeScreen;
