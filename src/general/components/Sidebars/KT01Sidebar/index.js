import 'assets/styles/keen/theme01/layout/aside/dark.css';
import AppResource from 'general/constants/AppResource';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';

function KT01Sidebar(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const pathName = router.pathname;
  const { t } = useTranslation();

  const menuItems = useMemo(() => {
    return [
      { type: 'section', text: 'HomePage' },
      { type: 'item', text: 'Dashboard', icon: 'fa-regular fa-grid-2', path: '/inbot/dashboard' },
      { type: 'section', text: 'Transportation' },
      {
        type: 'item',
        text: 'Order',
        icon: 'fa-regular fa-box',
        path: '/e-ship/order',
      },
      {
        type: 'item',
        text: 'DeliveryReceipt',
        icon: 'fa-regular fa-file-lines',
        path: '/e-ship/receipt',
      },
      {
        type: 'item',
        text: 'Shipper',
        icon: 'fa-regular fa-user',
        path: '/e-ship/shipper',
      },
      {
        type: 'item',
        text: 'PostOffice',
        icon: 'fa-regular fa-truck',
        path: '/e-ship/post-office',
      },
      { type: 'section', text: 'Shop' },
      { type: 'item', text: 'Employee', icon: 'fa-regular fa-users', path: '/e-ship/employee' },
      // { type: 'item', text: 'Shop', icon: 'fa-regular fa-user', path: '/setting' },
    ];
  }, []);

  // MARK: --- Hooks ---
  useEffect(() => {
    // Init Aside
    if (KTLayoutAside !== undefined) {
      KTLayoutAside.init('kt_aside');
    }

    // Init Aside Toggle
    if (KTLayoutAsideToggle !== undefined) {
      KTLayoutAsideToggle.init('kt_aside_toggle');
    }

    // Init Aside Menu
    if (KTLayoutAsideMenu !== undefined) {
      KTLayoutAsideMenu.init('kt_aside_menu');
    }
  }, []);

  return (
    <div
      className="aside aside-left aside-fixed d-flex flex-column flex-row-auto border"
      id="kt_aside"
    >
      {/* Aside Header */}
      <div className="brand flex-column-auto">
        {/* logo */}
        <div className="d-flex align-items-center">
          <a href="#" className="brand-logo">
            <img className="h-40px" src={AppResource.images.imgLogoText} alt="logo" />
          </a>
        </div>
        {/* button toggle */}
        <button className="brand-toggle btn btn-sm px-0 border-0" id="kt_aside_toggle">
          <span className="svg-icon svg-icon svg-icon-xl">
            <img src={AppResource.icons.keens.toggleRight} alt="toggle" />
          </span>
        </button>
      </div>

      {/* Aside Menu */}
      <div
        id="kt_aside_menu"
        className="aside-menu my-0"
        data-menu-scroll="1" // enable scroll
        data-menu-vertical="1"
        // data-menu-dropdown-timeout='500'
      >
        {/* Nav menu */}
        <ul className="menu-nav pt-0">
          {menuItems.map((item, index) => {
            // Item
            if (item?.type === 'item') {
              const hasSubMenuLV1Items = item?.subMenuItems !== undefined;

              return (
                <li
                  key={index}
                  className={`menu-item ${hasSubMenuLV1Items && 'menu-item-submenu'} ${
                    hasSubMenuLV1Items &&
                    item?.path?.length > 0 &&
                    pathName.includes(item.path) &&
                    'menu-item-open'
                  } ${
                    // !hasSubMenuLV1Items &&
                    item?.path?.length > 0 && pathName.includes(item.path) && 'menu-item-active'
                  }`}
                >
                  <Link
                    to={item?.path}
                    onClick={(e) => {
                      if (Utils.checkFullUrl(item?.path)) {
                        e.preventDefault();
                        Utils.openInNewTab(item?.path);
                      }
                    }}
                    className={`menu-link ${hasSubMenuLV1Items && 'menu-toggle'}`}
                  >
                    <span className="sgv-icon menu-icon">
                      <i className={`${item?.icon}`} />
                    </span>
                    <span className="menu-text">{t(item?.text)}</span>
                    {item?.label && (
                      <span className="menu-label">
                        <span className="label label-rounded label-danger label-inline">
                          {item?.label}
                        </span>
                      </span>
                    )}
                    {hasSubMenuLV1Items && <i className="menu-arrow" />}
                  </Link>
                  {/* Sub menu items level 1 */}
                  {hasSubMenuLV1Items && (
                    <div className="menu-submenu">
                      <ul className="menu-subnav">
                        {item?.subMenuItems?.map((subItemLV1, subIndexLV1) => {
                          const hasSubMenuLV2Items = subItemLV1?.subMenuItems !== undefined;

                          return (
                            <li
                              key={subIndexLV1}
                              className={`menu-item ${hasSubMenuLV2Items && 'menu-item-submenu'} ${
                                hasSubMenuLV2Items &&
                                pathName.includes(subItemLV1?.path) &&
                                'menu-item-open'
                              } ${
                                !hasSubMenuLV2Items &&
                                pathName.includes(subItemLV1?.path) &&
                                'menu-item-active'
                              }`}
                            >
                              <Link
                                className={`menu-link rounded-0 ${
                                  hasSubMenuLV2Items && 'menu-toggle'
                                }`}
                                to={subItemLV1?.path}
                              >
                                <i className="menu-bullet menu-bullet-dot">
                                  <span></span>
                                </i>
                                <span className="menu-text">{t(subItemLV1?.text)}</span>
                                {subItemLV1?.label && (
                                  <span className="menu-label">
                                    <span className="label label-rounded label-danger label-inline">
                                      {subItemLV1?.label}
                                    </span>
                                  </span>
                                )}
                                {hasSubMenuLV2Items && <i className="menu-arrow" />}
                              </Link>
                              {/* Sub menu items level 2 */}
                              {hasSubMenuLV2Items && (
                                <div className="menu-submenu">
                                  <ul className="menu-subnav">
                                    {subItemLV1?.subMenuItems?.map((subItemLV2, subIndexLV2) => {
                                      const hasSubMenuLV3Items =
                                        subItemLV2?.subMenuItems !== undefined;

                                      return (
                                        <li
                                          key={subIndexLV2}
                                          className={`menu-item ${
                                            hasSubMenuLV3Items && 'menu-item-submenu'
                                          } ${
                                            hasSubMenuLV3Items &&
                                            subItemLV2.path.length > 0 &&
                                            pathName.includes(subItemLV2.path) &&
                                            'menu-item-open'
                                          } ${
                                            !hasSubMenuLV3Items &&
                                            subItemLV2.path.length > 0 &&
                                            pathName.includes(subItemLV2.path) &&
                                            'menu-item-active'
                                          }`}
                                        >
                                          <Link
                                            className={`menu-link rounded-0 ${
                                              hasSubMenuLV3Items && 'menu-toggle'
                                            }`}
                                            to={subItemLV2?.path}
                                          >
                                            <i className="menu-bullet menu-bullet-dot">
                                              <span></span>
                                            </i>
                                            <span className="menu-text">{t(subItemLV2?.text)}</span>
                                            {subItemLV2?.label && (
                                              <span className="menu-label">
                                                <span className="label label-rounded label-danger label-inline">
                                                  {subItemLV2?.label}
                                                </span>
                                              </span>
                                            )}
                                            {hasSubMenuLV3Items && <i className="menu-arrow" />}
                                          </Link>
                                          {/* Sub menu items level 3 */}
                                          {hasSubMenuLV3Items && (
                                            <div className="menu-submenu">
                                              <ul className="menu-subnav">
                                                {subItemLV2?.subMenuItems?.map(
                                                  (subItemLV3, subIndexLV3) => {
                                                    const hasSubMenuLV4Items =
                                                      subItemLV3?.subMenuItems !== undefined;

                                                    return (
                                                      <li
                                                        key={subIndexLV3}
                                                        className={`menu-item ${
                                                          hasSubMenuLV4Items && 'menu-item-submenu'
                                                        } ${
                                                          hasSubMenuLV4Items &&
                                                          subItemLV3.path.length > 0 &&
                                                          pathName.includes(subItemLV3.path) &&
                                                          'menu-item-open'
                                                        } ${
                                                          !hasSubMenuLV4Items &&
                                                          subItemLV3.path.length > 0 &&
                                                          pathName.includes(subItemLV3.path) &&
                                                          'menu-item-active'
                                                        }`}
                                                      >
                                                        <Link
                                                          className={`menu-link rounded-0 ${
                                                            hasSubMenuLV4Items && 'menu-toggle'
                                                          }`}
                                                          to={subItemLV3?.path}
                                                        >
                                                          <i className="menu-bullet menu-bullet-dot">
                                                            <span></span>
                                                          </i>
                                                          <span className="menu-text">
                                                            {t(subItemLV3?.text)}
                                                          </span>
                                                          {subItemLV3?.label && (
                                                            <span className="menu-label">
                                                              <span className="label label-rounded label-danger label-inline">
                                                                {subItemLV3?.label}
                                                              </span>
                                                            </span>
                                                          )}
                                                          {hasSubMenuLV4Items && (
                                                            <i className="menu-arrow" />
                                                          )}
                                                        </Link>
                                                        {/* Sub menu items level 4 */}
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            }

            // Section
            if (item?.type === 'section') {
              return (
                <li key={index} className="menu-section mt-0">
                  <h4
                    className="menu-text font-weight-bolder"
                    style={{
                      color: AppResource.colors.feature,
                    }}
                  >
                    {t(item?.text)}
                  </h4>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}

export default KT01Sidebar;
