import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Translate, getActiveLanguage } from "react-localize-redux";
import { Col, Row } from "reactstrap";
import {
  PageHeader,
  Form,
  Tabs,
  Button,
  Table,
  Icon,
  InputNumber,
  Input,
  Upload,
  Spin,
} from "antd";
import axios from "axios";
import swal from "sweetalert";
import { Select, InputText } from "../../../../common/elements/ant-ui";
import {
  getGeneralSetting,
  updateGeneralSetting,
  getBannerSetting,
  getBannerSettingById,
  createBannerSetting,
  updateBannerSetting,
  achiveBannerSetting,
  getFeaturedProducts,
  updateFeaturedProducts,
  getMenuItems,
  getChildMenuItems,
  getMenuItemsById,
  createMenuItem,
  updateMenuItem,
  achiveMenuItem,
} from "./service";
import history from "../../../../common/router/history";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import Util from "./../../../../common/util";
import "./style.css";

const WebsiteSetting = (props) => {
  // General State
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [description,setDescription] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [generalLoadingButton, setGeneralLoadingButton] = useState(false);
  const [placeholderImage, setPlaceholderImage] = useState(null);
  const [theme, setTheme] = useState("");

  // Banner State
  const [visibleFormBanner, setVisibleFormBanner] = useState(false);
  const [visibleBannerTable, setVisibleBannerTable] = useState(true);
  const [bannerId, setBannerId] = useState(undefined);
  const [bannerName, setBannerName] = useState("");
  const [bannerType, setBannerType] = useState(0);
  const [bannerPosition, setBannerPosition] = useState("");
  const [dataSourceBanner, setDataSourceBanner] = useState([]);
  const [deleteDataSourceBanner, setDeleteDataSourceBanner] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(false);
  const [loadingUpdateBanner, setLoadingUpdateBanner] = useState(false);
  const [loadingButtonBanner, setLoadingButtonBanner] = useState(false);

  // Featured Products State
  const [productSearch, setProductSearch] = useState([]);
  const [productEntries, setProductEntries] = useState([]);
  const [deleteProductEntries, setDeleteProductEntries] = useState([]);
  const [loadingFeaturedProduct, setLoadingFeaturedProduct] = useState(false);
  const [loadingButtonFeaturedProduct, setLoadingButtonFeaturedProduct] =
    useState(false);


  // Menu Item State
  const [menuItemId, setMenuItemId] = useState(undefined);
  const [loadingButtonMenuItem,setLoadingButtonMenuItem] = useState(false);
  const [loadingFormUpdateMenuItem,setLoadingFormUpdateMenuItem] = useState(false);
  const [urlMenuItem,setUrlMenuItem] = useState("");
  const [routeMenuItem,setRouteMenuItem] = useState("");
  const [targetMenuItem,setTagetMenuItem] = useState("");
  const [orderMenuItem,setOrderMenuItem] = useState(undefined);
  const [chilsMenuItem,setChilsMenuItem] = useState([]);
  const [linkType,setLinkType] = useState("");
  const [menuItemTitle,setMenuItemTitle] = useState("");
  const [visibleFormMenuItems, setVisibleFormMenuItems] = useState(false);
  const [visibleMenuItemsTable, setVisibleMenuItemsTable] = useState(true); 
  const [menuItemList,setMenuItemList] = useState([]);
  const [subMenuItems,setSubMenuItems] = useState([]);
  const [loadingMenuItemList,setLoadingMenuItemList] = useState(false);
  

  // SEO State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaTagDescription, setMetaTagDescription] = useState("");
  const [metaTagKeyword, setMetaTagKeyword] = useState("");
  const [loadingButtonSeo, setLoadingButtonSeo] = useState(false);

  // Social Media State

  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [telegram, setTelegram] = useState("");
  const [loadingButtonSocialMedia, setLoadingButtonSocialMedia] = useState(false);

  const { TabPane } = Tabs;
  const { getFieldDecorator } = props.form;
  const util = new Util();
  

  // General Function
  const fetchGeneral = () => {
    getGeneralSetting().then((response) => {
      if (response.data.data) {
        const data = response.data.data;

        if ("facebook" in data) {
          setFacebook(data.facebook);
        }

        if ("instagram" in data) {
          setInstagram(data.instagram);
        }

        if ("youtube" in data) {
          setYoutube(data.youtube);
        }

        if ("telegram" in data) {
          setTelegram(data.telegram);
        }

        if ("metaTitle" in data) {
          setMetaTitle(data.metaTitle);
        }

        if ("metaTagDescription" in data) {
          setMetaTagDescription(data.metaTagDescription);
        }

        if ("metaTagKeyword" in data) {
          setMetaTagKeyword(data.metaTagKeyword);
        }

        if ("primaryColor" in data) {
          setPrimaryColor(data.primaryColor);
        }

        if ("secondColor" in data) {
          setSecondaryColor(data.secondColor);
        }

        if("description" in data){
          setDescription(data.description);
        }

        if ("theme" in data) {
          setTheme(data.theme);
        }
        if (!data.placeHolderImage) {
          setPlaceholderImage(null);
        } else {
          const splitName = data.placeHolderImage.split("/");

          setPlaceholderImage({
            ...{
              uid: "1",
              name: splitName[2],
              status: "done",
              url: util.getWebsitePlaceholderImage(data.placeHolderImage).url,
            },
          });
        }
      }
    });
  };

  const onChangeColor = (event, name) => {
    if (name === "primaryColor") {
      setPrimaryColor(event.target.value);
    } else {
      setSecondaryColor(event.target.value);
    }
  };

  const onSelectTheme = (value) => {
    setTheme(value);
  };

  const onGeneralSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setGeneralLoadingButton(true);
        let general = [
          {
            key: "primaryColor",
            value: primaryColor,
          },
          {
            key: "description",
            value: values.description ? values.description : "",
          },
          {
            key: "secondColor",
            value: secondaryColor,
          },
          {
            key: "placeHolderImage",
            value: values["placeHolderImage"]
              ? `website/placeholder/${getImageFromUpload(
                  values,
                  "placeHolderImage"
                )}`
              : "",
          },
          {
            key: "theme",
            value: theme,
          },
        ];
        updateGeneralSetting(general)
          .then(() => {
            fetchGeneral();
            swal(CATranslate("text_save_success", props.locale), {
              buttons: false,
              timer: 1500,
              icon: "success",
            });
          })
          .finally(() => {
            setGeneralLoadingButton(false);
          });
      }
    });
  };

  // Banner Function
  const fetchBanner = () => {
    setLoadingBanner(true);
    getBannerSetting()
      .then((response) => {
        if (response.data && response.data.data) {
          setBannerList(response.data.data);
        }
      })
      .finally(() => {
        setLoadingBanner(false);
      });
  };

  const onDeleteBanner = (id) => {
    util
      .sweetAlertConfirm(CATranslate("text_confirm_delete", props.locale))
      .then((willDelete) => {
        if (willDelete) {
          achiveBannerSetting(id).then(() => {
            fetchBanner();
          });
        }
      });
  };

  const onBackToTable = () => {
    props.form.resetFields();
    setDataSourceBanner([]);
    setBannerName("");
    setBannerPosition("");
    setDeleteDataSourceBanner([]);
    fetchBanner();
    setVisibleFormBanner(false);
    setVisibleBannerTable(true);
    setLoadingButtonBanner(false);
    setBannerId(undefined);
  };

  const onShowFormBanner = (id) => {
    if (id) {
      setBannerId(id);
      setLoadingUpdateBanner(true);
      getBannerSettingById(id)
        .then((response) => {
          if (response.data && response.data.data) {
            const data = response.data.data;
            const bannerImage = data.banner_images.map((value) => {
              const splitName = value.image ? value.image.split("/") : null;
              return {
                id: value.id,
                bannerId: value.bannerId,
                description: value.description,
                label: value.label,
                descriptionkm: value.descriptionkm,
                name: value.name,
                namekm: value.namekm,
                order: value.order,
                link: value.link,
                image: value.image
                  ? {
                      uid: `${Date.now()}`,
                      name: splitName[2],
                      status: "done",
                      url: util.getWebsitePlaceholderImage(value.image).url,
                    }
                  : null,
              };
            });
            setDataSourceBanner(bannerImage);
            setBannerName(data.name);
            setBannerType(data.type);
            setBannerPosition(data.position);
          }
        })
        .finally(() => setLoadingUpdateBanner(false));
    }
    setVisibleFormBanner(true);
    setVisibleBannerTable(false);
  };

  const handleButtonAddBanner = () => {
    dataSourceBanner.push({
      name: "",
      description: "",
      label: "",
      link: "",
      image: null,
      order: null,
    });
    setDataSourceBanner([...dataSourceBanner]);
  };

  const onChangeImageName = (value, findIndex) => {
    dataSourceBanner.forEach((preValue, index) => {
      if (index === findIndex) {
        if (value) {
          dataSourceBanner[index]["image"] = value;
        } else {
          dataSourceBanner[index]["image"] = null;
        }
      }
    });

    setDataSourceBanner([...dataSourceBanner]);
  };

  const handleButtonRemoveBanner = (value, findIndex) => {
    if ("id" in value) {
      const foundDelete = dataSourceBanner.find((preValue, index) => index === findIndex);
      foundDelete["status"] = 3;

      setDeleteDataSourceBanner([...deleteDataSourceBanner, foundDelete]);
    }
    dataSourceBanner.splice(findIndex, 1);

    setDataSourceBanner([...dataSourceBanner]);
  };

  const onChangeBannerInput = (event, findIndex, key) => {
    dataSourceBanner.forEach((preValue, index) => {
      if (index === findIndex) {
        dataSourceBanner[index][key] = event.target.value;
      }
    });

    setDataSourceBanner([...dataSourceBanner]);
  };

  const onChangeOrderBanner = (value, findIndex) => {
    dataSourceBanner.forEach((preValue, index) => {
      if (index === findIndex) {
        dataSourceBanner[index]["order"] = value;
      }
    });

    setDataSourceBanner([...dataSourceBanner]);
  };

  const onBannerSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoadingButtonBanner(true);
        // eslint-disable-next-line
        const entries = dataSourceBanner.filter((value) => {
          if ("id" in value) {
            return true;
          } else {
            if (value.name !== "" || value.image !== null) {
              return true;
            }
          }
        });
        const newEntries = entries.map((value) => {
          if ("id" in value) {
            return {
              id: value.id,
              name: value.name,
              description: value.description,
              label: value.label,
              link: value.link,
              image: value.image ? `website/banner/${value.image.name}` : null,
              order: value.order,
            };
          } else {
            return {
              name: value.name,
              description: value.description,
              label: value.label,
              link: value.link,
              image: value.image ? `website/banner/${value.image.name}` : null,
              order: value.order,
            };
          }
        });
        values["entries"] = [...newEntries, ...deleteDataSourceBanner];
        if (bannerId) {
          updateBannerSetting(bannerId, values)
            .then(() => {
              onBackToTable();
            })
            .finally(() => setLoadingButtonBanner(false));
        } else {
          createBannerSetting(values)
            .then(() => {
              onBackToTable();
            })
            .finally(() => setLoadingButtonBanner(false));
        }
      }
    });
  };

  // Menu Items Builder

  const fetchMenuItems = () => {
    setLoadingMenuItemList(true);
    getMenuItems().then(response =>{
      if(response && response.data.data){
        setMenuItemList(response.data.data);
      }
    }).then(() => setLoadingMenuItemList(false));
  };

  const onShowFormMenuItem = (id) => {
    getChildMenuItems().then(response => {
      if(response && response.data.data){
        setSubMenuItems(response.data.data.map(value =>(
          {
            value: value.id,
            name: value.title,
          }
        )));
      }
    });

    if(id){
      setMenuItemId(id);
      setLoadingFormUpdateMenuItem(true);
      getMenuItemsById(id).then(response =>{
        if (response.data && response.data.data) {
          const data = response.data.data;
          setMenuItemTitle(data.title);
          setChilsMenuItem(data.childs.map(value => value.id));
          setOrderMenuItem(data.order);
          setTagetMenuItem(data.target);
          setRouteMenuItem(data.route);
          setUrlMenuItem(data.url);
          if(data.url) setLinkType("static_url");
          if(data.route) setLinkType("dynamic_route");
        }
      }).finally(() => setLoadingFormUpdateMenuItem(false));
    }
    setVisibleFormMenuItems(true);
    setVisibleMenuItemsTable(false);
  };

  const onChangeLinkType = (value) =>{
    setLinkType(value);
  };

  const onBackToMenuItemTable = () => {
    props.form.resetFields();
    setMenuItemTitle("");
    setChilsMenuItem([]);
    setOrderMenuItem(undefined);
    setTagetMenuItem("");
    setRouteMenuItem("");
    setUrlMenuItem("");
    fetchMenuItems();
    setLinkType("");
    setVisibleFormMenuItems(false);
    setVisibleMenuItemsTable(true);
    setLoadingFormUpdateMenuItem(false);
    setLoadingButtonMenuItem(false);
    setMenuItemId(undefined);
  };
  const onDeleteMenuItem = (id) => {
    util
    .sweetAlertConfirm(CATranslate("text_confirm_delete", props.locale))
    .then((willDelete) => {
      if (willDelete) {
        achiveMenuItem(id).then(() => {
          fetchMenuItems();
        });
      }
    });
  };

  const onMenuItemSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {  
      if (!err) {
        setLoadingButtonMenuItem(true);
        let newValues ={
          title: values["title"],
          target: values["target"],
          order: values["order"],
          childs: values["childs"],
          url: "",
          route: "",
        };
        if(linkType === "static_url"){
          newValues["url"] = values["url"];      
        }else{
          newValues["route"] = values["route"];
        }
        if(menuItemId){
          updateMenuItem(menuItemId,newValues).then(() => {
            onBackToMenuItemTable();
          }).finally(() => setLoadingButtonMenuItem(false));
        }else{
          createMenuItem(newValues).then(() => {
            onBackToMenuItemTable();
          }).finally(() => setLoadingButtonMenuItem(false));
        }    
      }
    });
  };



  

  // featured Products Function
  const onFeaturedProductSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoadingButtonFeaturedProduct(true);
        if (deleteProductEntries.length > 0) {
          updateFeaturedProducts(deleteProductEntries)
            .then(() => {
              fetchFeaturedProducts();
              swal(CATranslate("text_save_success", props.locale), {
                buttons: false,
                timer: 1500,
                icon: "success",
              });
            })
            .finally(() => setLoadingButtonFeaturedProduct(false));
        } else {
          updateFeaturedProducts(productEntries)
            .then(() => {
              fetchFeaturedProducts();
              swal(CATranslate("text_save_success", props.locale), {
                buttons: false,
                timer: 1500,
                icon: "success",
              });
            })
            .finally(() => setLoadingButtonFeaturedProduct(false));
        }
      }
    });
  };

  const fetchFeaturedProducts = () => {
    setLoadingFeaturedProduct(true);
    getFeaturedProducts()
      .then((response) => {
        if (response.data && response.data.data) {
          const newProductEntries = response.data.data.map((value) => ({
            id: value.id,
            name: value.name,
            image: value.image,
            isFeatured: value.isFeatured,
            defaultValue: 1,
          }));
          setDeleteProductEntries(newProductEntries);
          setProductEntries(response.data.data);
        }
      })
      .finally(() => setLoadingFeaturedProduct(false));
  };

  const handleOnSelectList = (product) => {
    const existingProductList = productEntries;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: product.id,
        name: product.name,
        image: product.image,
        isFeatured: 1,
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((value) => {
        if (value.id === product.id) {
          isNotTheSameProduct = false;
        }
      });
      if (isNotTheSameProduct) {
        existingProductList.push({
          id: product.id,
          name: product.name,
          image: product.image,
          isFeatured: 1,
        });
      }
    }
    if (deleteProductEntries.length > 0) {
      let notFound = true;
      deleteProductEntries.forEach((value, index) => {
        if (value.id === product.id) {
          if ("defaultValue" in value) {
            deleteProductEntries[index]["isFeatured"] = 1;
            notFound = false;
          }
        }
      });

      if (notFound) {
        deleteProductEntries.push({
          id: product.id,
          name: product.name,
          image: product.image,
          isFeatured: 1,
        });
      }
      setDeleteProductEntries([...deleteProductEntries]);
    }
    setProductEntries([...existingProductList]);
    props.form.setFieldsValue({ searchProduct: "" });
    setProductSearch([]);
    document.getElementById("searchProduct").focus();
  };

  const handleRemoveEntry = (record, findIndex) => {
    util
      .sweetAlertConfirm(CATranslate("text_confirm_delete", props.locale))
      .then((willDelete) => {
        if (willDelete) {
          if (deleteProductEntries.length > 0) {
            deleteProductEntries.forEach((value, index) => {
              if (value.id === record.id) {
                if ("defaultValue" in value) {
                  deleteProductEntries[index]["isFeatured"] = 0;
                } else {
                  deleteProductEntries.splice(index, 1);
                }
                setDeleteProductEntries([...deleteProductEntries]);
              }
            });
          }
          productEntries.splice(findIndex, 1);
          setProductSearch([]);
          setProductEntries([...productEntries]);
        }
      });
  };

  const entryColumn = [
    {
      title: <Translate id="text_image" />,
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          alt="product"
          src={util.getProductImage(image).url}
          width={60}
          height={60}
        />
      ),
    },
    {
      title: <Translate id="text_product_name" />,
      dataIndex: "name",
      key: "name",
    },

    {
      title: <Translate id="text_action" />,
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => (
        <Icon
          type="delete"
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleRemoveEntry(record, index)}
        />
      ),
    },
  ];

  // SEO Function
  const onSeoSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoadingButtonSeo(true);
        const seo = [
          {
            key: "metaTitle",
            value: values.metaTitle ? values.metaTitle : "",
          },
          {
            key: "metaTagDescription",
            value: values.metaTagDescription ? values.metaTagDescription : "",
          },
          {
            key: "metaTagKeyword",
            value: values.metaTagKeyword ? values.metaTagKeyword : "",
          },
        ];
        updateGeneralSetting(seo)
          .then(() => {
            fetchGeneral();
            swal(CATranslate("text_save_success", props.locale), {
              buttons: false,
              timer: 1500,
              icon: "success",
            });
          })
          .finally(() => {
            setLoadingButtonSeo(false);
          });
      }
    });
  };

  // Social Media Function

  const onSocialMediaSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoadingButtonSocialMedia(true);
        const socialMedia = [
          {
            key: "facebook",
            value: values.facebook ? values.facebook : "",
          },
          {
            key: "instagram",
            value: values.instagram ? values.instagram : "",
          },
          {
            key: "youtube",
            value: values.youtube ? values.youtube : "",
          },
          {
            key: "telegram",
            value: values.telegram ? values.telegram : "",
          }
        ];
        updateGeneralSetting(socialMedia)
          .then(() => {
            fetchGeneral();
            swal(CATranslate("text_save_success", props.locale), {
              buttons: false,
              timer: 1500,
              icon: "success",
            });
          })
          .finally(() => {
            setLoadingButtonSocialMedia(false);
          });
      }
    });
  };

  // useEffect
  useEffect(() => {
    fetchGeneral();
    // eslint-disable-next-line
  }, []);

  //
  const onChangeTab = (key) => {
    if(key === "banner"){
      fetchBanner();
    }else if(key === "featured_products"){
      fetchFeaturedProducts();
    }else if(key === "menu_builder"){
      fetchMenuItems();
    }
  };

  const getImageFromUpload = (value, key = "image") => {
    let image = "";

    if (value === null) return image;

    if (
      key in value &&
      value[key] &&
      "file" in value[key] &&
      value[key]["file"] &&
      "name" in value[key]["file"]
    ) {
      image = value[key]["file"]["name"];
    }

    return image;
  };

  const uploadProps = {
    listType: "picture-card",
    onRemove: (file) => {
      axios({
        method: "DELETE",
        url: `${util.getAPIURL()}/file/v1/delete`,
        data: { path: `website/placeholder/${file.name}` },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${util.getAccessToken()}`,
        },
      }).then((response) => {
        props.form.setFieldsValue({ placeHolderImage: null });
      });
      setPlaceholderImage(null);
    },
    beforeUpload: (file) => {
      return false;
    },
    fileList: placeholderImage ? [placeholderImage] : [],
    onChange: ({ fileList, file }) => {
      let formData = new FormData();
      formData.append("image", file);
      if (file.status !== "removed") {
        axios
          .post(
            `${util.getAPIURL()}/file/v1/upload/web_placeholder`,
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${util.getAccessToken()}`,
              },
            }
          )
          .then((response) => {
            setPlaceholderImage({
              uid: "1",
              name: response.data.originalname,
              status: "done",
              url: response.data.location,
            });
          });
      }
    },
  };

  const getCurrentIndexLanguage = (state) => {
    const currentLanguage = getActiveLanguage(state);
    for (var i = 0; i < state.languages.length; i++) {
      if (state.languages[i].code === currentLanguage.code) {
        return i;
      }
    }
  };

  const CATranslate = (key, state) => {
    const currentIndex = getCurrentIndexLanguage(state);

    if (state.translations[key] == null) return null;
    return state.translations[key][currentIndex];
  };

  return (
    <React.Fragment>
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_website_setting" />}
        subTitle=""
      />
      <div className="main-layout main-store-account">
        <Row>
          <Col md="12">
            <Tabs
              type="card"
              onChange={onChangeTab}
              defaultActiveKey={"general"}
            >
              <TabPane tab={<Translate id="text_general" />} key="general">
                <Row>
                  <Col lg="4" md="4">
                    <Form onSubmit={onGeneralSubmit}>
                      <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label">
                          <label>{<Translate id="text_primary_color" />}</label>
                        </div>
                        <div className="ant-col ant-form-item-control-wrapper">
                          <div className="ant-form-item-control">
                            <span
                              className="ant-form-item-children"
                              id="color-picker"
                            >
                              <input
                                type="color"
                                className="ant-input"
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                                value={primaryColor}
                                onChange={(event) =>
                                  onChangeColor(event, "primaryColor")
                                }
                              />
                              <label className="notation-textfield"></label>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label">
                          <label>
                            {<Translate id="text_secondary_color" />}
                          </label>
                        </div>
                        <div className="ant-col ant-form-item-control-wrapper">
                          <div className="ant-form-item-control">
                            <span
                              className="ant-form-item-children"
                              id="color-picker"
                            >
                              <input
                                type="color"
                                className="ant-input"
                                style={{
                                  padding: 0,
                                  margin: 0,
                                }}
                                value={secondaryColor}
                                onChange={(event) =>
                                  onChangeColor(event, "secondaryColor")
                                }
                              />
                              <label className="notation-textfield"></label>
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* <Select
                        label={<Translate id="text_theme" />}
                        form={props.form}
                        onChange={onSelectTheme}
                        defaultValue={theme}
                        required={true}
                        name="theme"
                        placeholder={
                          <Translate id="text_please_select_theme" />
                        }
                        dataSource={[
                          {
                            value: "template_1",
                            name: "Hmart",
                          },
                          {
                            value: "template_2",
                            name: "Koganic",
                          },
                          {
                            value: "template_3",
                            name: "Stylista",
                          },
                          {
                            value: "template_4",
                            name: "Technocy",
                          }
                        ]}
                      /> */}
                      <InputText
                        data={description}
                        name="description"
                        label={<Translate id="text_store_description" />}
                        placeholder={CATranslate(
                          "text_store_description",
                          props.locale
                        )}
                        form={props.form}
                      />
                      {React.useMemo(
                        () => (
                          <UploadImage
                            uploadProps={uploadProps}
                            form={props.form}
                            name="placeHolderImage"
                            label={<Translate id="text_placeholder_image" />}
                          />
                        ),
                        // eslint-disable-next-line
                        [placeholderImage]
                      )}
                      {/* <UploadImg
                        data={{ file: placeholderImage }}
                        fileList={[placeholderImage]}
                        name="placeHolderImage"
                        label={"Placeholder Image"}
                        endPoint={`${util.getAPIURL()}/file/v1/upload/web_placeholder`}
                        endPointDelete={`${util.getAPIURL()}/file/v1/delete`}
                        accessToken={util.getAccessToken()}
                        pathName={"website/placeholder"}
                        form={props.form}
                      /> */}
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn info undefined"
                        loading={generalLoadingButton}
                      >
                        <span className="icon-save icon-padding-right"></span>
                        {<Translate id="text_save" />}
                      </Button>
                    </Form>
                  </Col>
                   <Col lg="8" md="8">
                      <div className="ant-row ant-form-item">
                        <div className="ant-col ant-form-item-label">
                          <label>
                            Theme
                          </label>
                        </div>
                        </div>
                      <Row>
                         <Col lg="4" md="4">
                          <div onClick={() => onSelectTheme("template_1")}>
                              <div  id="image-position">
                                <img src={require("../../../../common/components/layout/styles/images/index-1.jpg")} alt={"template 1"} width={"100%"} height="100%"  id="image-border" />
                               {
                                  theme === "template_1" && <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{fontSize: 40}}/>
                               }
                              </div> 
                              <div className="image-title"><span>Hmart</span></div>
                          </div>
                         </Col>
                         <Col lg="4" md="4">
                          <div  onClick={() => onSelectTheme("template_2")} >
                            <div id="image-position">
                                <img src={require("../../../../common/components/layout/styles/images/index-4.jpg")} alt={"template 2"} width={"100%"} height="100%"  id="image-border" />
                                {
                                  theme === "template_2" && <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{fontSize: 40}}/>
                                }
                              </div>  
                              <div className="image-title"><span>Koganic</span></div>
                          </div>
                         </Col>
                         <Col lg="4" md="4">
                          <div  onClick={() => onSelectTheme("template_3")}>
                             <div id="image-position">
                                <img src={require("../../../../common/components/layout/styles/images/index-3.jpg")} alt={"template 3"} width={"100%"} height="100%"   id="image-border" />
                                {
                                  theme === "template_3" && <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{fontSize: 40}}/>
                                }
                              </div> 
                              <div className="image-title"><span>Stylista</span></div>
                          </div>
                         </Col>
                      </Row>
                      <Row style={{marginTop: 30}}>
                          <Col lg="4" md="4">
                          <div  onClick={() => onSelectTheme("template_4")}>
                              <div id="image-position">
                                <img src={require("../../../../common/components/layout/styles/images/index-2.jpg")} alt={"template 4"} width={"100%"} height="100%"  id="image-border" />
                                {
                                  theme === "template_4" && <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{fontSize: 40}}/>
                                }
                              </div>      
                              <div className="image-title"><span>Technocy</span></div>
                          </div>
                          </Col>
                      </Row>
                   </Col>
                </Row>
              </TabPane>
              <TabPane tab={<Translate id="text_banner" />} key="banner">
                <Row>
                  <Col lg="12" md="12">
                    <Form onSubmit={onBannerSubmit}>
                      {visibleBannerTable && (
                        <React.Fragment>
                          <Button
                            type="info"
                            id="btnAdd"
                            className="ant-btn info mg-right text-uppercase"
                            onClick={() => onShowFormBanner()}
                          >
                            <span className="icon-add icon-padding-right"></span>
                            {<Translate id="text_add_new" />}
                          </Button>
                          <Table
                            rowKey={(record) => record.id.toString()}
                            dataSource={bannerList}
                            columns={[
                              {
                                title: <Translate id="text_banner_name" />,
                                dataIndex: "name",
                                key: "name",
                              },
                              {
                                title: <Translate id="text_action" />,
                                dataIndex: "id",
                                key: "id",
                                render: (id) => {
                                  return (
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <Icon
                                        type="edit"
                                        style={{
                                          marginRight: 8,
                                          cursor: "pointer",
                                        }}
                                        onClick={() => onShowFormBanner(id)}
                                      />
                                      <Icon
                                        type="delete"
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                        }}
                                        onClick={() => onDeleteBanner(id)}
                                      />
                                    </div>
                                  );
                                },
                              },
                            ]}
                            loading={loadingBanner}
                            pagination={false}
                          />
                        </React.Fragment>
                      )}

                      {visibleFormBanner && (
                        <React.Fragment>
                          <PageHeader
                            style={{
                              padding: "0px 0px 15px 0px",
                            }}
                            onBack={onBackToTable}
                            title={
                              bannerId ? (
                                <Translate id="text_edit_banner" />
                              ) : (
                                <Translate id="text_new_banner" />
                              )
                            }
                            subTitle=""
                          />
                          <InputText
                            data={bannerName}
                            style={{ width: 300 }}
                            name="name"
                            label={<Translate id="text_banner_name" />}
                            required={true}
                            placeholder={CATranslate(
                              "text_banner_name",
                              props.locale
                            )}
                            form={props.form}
                          />
                          <Select
                            label="Type"
                            form={props.form}
                            defaultValue={bannerType}
                            required={true}
                            name="type"
                            placeholder={"Select type"}
                            dataSource={[
                              {
                                value: 0,
                                name: "Home Page",
                              },
                              {
                                value: 1,
                                name: "Shop"
                              },
                            ]}
                            style={{maxWidth: 300}}
                          />
                          <Select
                            label="Position"
                            form={props.form}
                            defaultValue={bannerPosition}
                            required={true}
                            name="position"
                            placeholder={"Select position"}
                            dataSource={[
                              {
                                value: "TOP",
                                name: "Top",
                              },
                              {
                                value: "CENTER",
                                name: "Center"
                              },
                              {
                                value: "BOTTOM",
                                name: "Bottom"
                              },
                            ]}
                            style={{maxWidth: 300}}
                          />
                          <Spin
                            spinning={loadingUpdateBanner}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <table style={{ width: "100%" }}>
                              <thead className="ant-table-thead">
                                <tr>
                                  <th
                                    className="ant-table-header-column"
                                    style={{ width: 300 }}
                                  >
                                    {<Translate id="text_image" />}
                                  </th>
                                  <th
                                    className="ant-table-header-column"
                                    style={{ width: 250 }}
                                  >
                                    {<Translate id="text_name" />}
                                  </th>
                                  <th
                                    style={{ width: 250 }}
                                    className="ant-table-header-column"
                                  >
                                    {<Translate id="text_description" />}
                                  </th>
                                  <th className="ant-table-header-column" style={{width: 150}}>
                                    {<Translate id="text_label" />}
                                  </th>
                                  <th style={{ width: 250 }} className="ant-table-header-column">
                                    {<Translate id="text_link" />}
                                  </th>

                                  <th className="ant-table-header-column" style={{ width: 100 }}>
                                    {<Translate id="text_sort" />}
                                  </th>
                                  <th
                                    className="ant-table-header-column"
                                    style={{ width: 50 }}
                                  ></th>
                                </tr>
                              </thead>
                              <tbody className="ant-table-tbody">
                                {dataSourceBanner.map((value, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      className={
                                        "ant-table-row ant-table-row-level-0"
                                      }
                                    >
                                      <td>
                                        <UploadImageBanner
                                          fileList={
                                            value.image ? [value.image] : []
                                          }
                                          util={util}
                                          form={props.form}
                                          name={`image${index}`}
                                          onChangeImageName={onChangeImageName}
                                          index={index}
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          value={value.name}
                                          onChange={(value) =>
                                            onChangeBannerInput(
                                              value,
                                              index,
                                              "name"
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Input.TextArea
                                          rows={4}
                                          value={value.description}
                                          onChange={(value) =>
                                            onChangeBannerInput(
                                              value,
                                              index,
                                              "description"
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          value={value.label}
                                          onChange={(value) =>
                                            onChangeBannerInput(
                                              value,
                                              index,
                                              "label"
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          value={value.link}
                                          onChange={(value) =>
                                            onChangeBannerInput(
                                              value,
                                              index,
                                              "link"
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <InputNumber
                                          type={"number"}
                                          value={value.order}
                                          onChange={(event) =>
                                            onChangeOrderBanner(event, index)
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Icon
                                          onClick={() =>
                                            handleButtonRemoveBanner(
                                              value,
                                              index
                                            )
                                          }
                                          type="minus-circle"
                                          style={{
                                            fontSize: "32px",
                                            cursor: "pointer",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr
                                  className={
                                    "ant-table-row ant-table-row-level-0"
                                  }
                                >
                                  <td colSpan={6}>
                                    <Icon
                                      onClick={handleButtonAddBanner}
                                      type="plus-circle"
                                      style={{
                                        fontSize: "32px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Spin>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="ant-btn info undefined"
                            loading={loadingButtonBanner}
                            style={{ marginTop: 15 }}
                          >
                            <span className="icon-save icon-padding-right"></span>
                            {<Translate id="text_save" />}
                          </Button>
                        </React.Fragment>
                      )}
                    </Form>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={"Featured Products"} key="featured_products">
                <Row>
                  <Col lg="4" md="4">
                    <Form onSubmit={onFeaturedProductSubmit}>
                      <SearchProductDropdown
                        productSearch={productSearch}
                        handleOnSelectList={handleOnSelectList}
                        locale={props.locale}
                        showIcon={false}
                        form={props.form}
                      />

                      <Table
                        rowKey={(record, index) => index}
                        columns={entryColumn}
                        dataSource={productEntries}
                        pagination={false}
                        loading={loadingFeaturedProduct}
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn info undefined"
                        loading={loadingButtonFeaturedProduct}
                        style={{ marginTop: 15 }}
                      >
                        <span className="icon-save icon-padding-right"></span>
                        {<Translate id="text_save" />}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={"Menu Builder"} key="menu_builder">
                <Row>
                  <Col lg="12" md="12">
                    <Form onSubmit={onMenuItemSubmit}>
                    {visibleMenuItemsTable && (
                        <React.Fragment>
                          <Button
                            type="info"
                            id="btnAdd"
                            className="ant-btn info mg-right text-uppercase"
                            onClick={() => onShowFormMenuItem()}
                          >
                            <span className="icon-add icon-padding-right"></span>
                            {<Translate id="text_add_new" />}
                          </Button>

                          {
                            loadingMenuItemList ? 
                            
                           <div className="spinning-menu-item-list">
                             <Spin spinning={loadingMenuItemList} /> 
                           </div>
                            : 
                           <React.Fragment>
                             {
                              Array.isArray(menuItemList)  && menuItemList.map((menuItem,index) => {
                                return (
                                  <div key={index}> 
                                    <div className="menu-item-list">        
                                        <span style={{marginLeft: 25}}>{menuItem.title}</span>
                                        <div className="menu-btn">
                                          <Icon
                                            type="edit"
                                            style={{
                                                marginRight: 8,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => onShowFormMenuItem(menuItem.id)}
                                            />
                                            <Icon
                                              type="delete"
                                              style={{
                                                cursor: "pointer",
                                                color: "red",
                                              }}
                                              onClick={() => onDeleteMenuItem(menuItem.id)}
                                            />
                                        </div>
                                    </div>
                                    {
                                      menuItem.childs.map((child,index) => {
                                        return (
                                          <div style={{marginLeft: 25}} key={index}>
                                          <div className="menu-item-list">
                                            <span style={{marginLeft: 25}}>{child.title}</span>
                                                <div className="menu-btn">
                                                  <Icon
                                                    type="edit"
                                                    style={{
                                                        marginRight: 8,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => onShowFormMenuItem(child.id)}
                                                    />
                                                    <Icon
                                                      type="delete"
                                                      style={{
                                                        cursor: "pointer",
                                                        color: "red",
                                                      }}
                                                      onClick={() => onDeleteMenuItem(child.id)}
                                                    />
                                                </div>  
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                
                                  </div>
                                );
                              })
                            }
                           </React.Fragment>
                          }                       
                        </React.Fragment>
                      )}

                      {
                        visibleFormMenuItems && (
                          <React.Fragment>
                          <PageHeader
                            style={{
                              padding: "0px 0px 15px 0px",
                            }}
                            onBack={onBackToMenuItemTable}
                            title={
                              menuItemId ? (
                                "Edit Menu Item"
                              ) : (
                                "New Menu Item"
                              )
                            }
                            subTitle=""
                          />

                          {
                            loadingFormUpdateMenuItem ? 
                            <div className="spinning-menu-item-list">
                            <Spin spinning={loadingFormUpdateMenuItem} /> 
                          </div> :
                          <React.Fragment>
                          <InputText
                            data={menuItemTitle}
                            style={{ width: 300 }}
                            name="title"
                            label={"Title of the Menu Item"}
                            required={true}
                            placeholder="Title of the Menu Item"
                            form={props.form}
                          />
                          <Select
                            label="Link Type"
                            form={props.form}
                            defaultValue={linkType}
                            required={true}
                            name="linkType"
                            onChange={onChangeLinkType}
                            placeholder={"Select link type"}
                            dataSource={[
                              {
                                value: "static_url",
                                name: "Static URL",
                              },
                              {
                                value: "dynamic_route",
                                name: "Dynamic Route"
                              },
                            ]}
                            style={{maxWidth: 300}}
                          />
                          {
                            linkType === "static_url" ?  <InputText
                            data={urlMenuItem}
                            style={{ width: 300 }}
                            name="url"
                            label={"URL for the Menu Item"}
                            required={true}
                            placeholder="URL for the Menu Item"
                            form={props.form}
                          /> 
                          : linkType === "dynamic_route" ?   
                          <Select
                          label="Route"
                          form={props.form}
                          defaultValue={routeMenuItem}
                          required={true}
                          name="route"
                          placeholder={"Select route"}
                          dataSource={[
                            {
                              value: "/",
                              name: "Home",
                            },
                            {
                              value: "/products",
                              name: "Shop"
                            },
                            {
                              value: "/contact",
                              name: "Contact"
                            },
                          ]}
                          style={{maxWidth: 300}}
                         />
                          :
                          ""
                          }
                         
                          <Select
                            label="Open In"
                            form={props.form}
                            defaultValue={targetMenuItem}
                            required={true}
                            name="target"
                            placeholder={"Select open in"}
                            dataSource={[
                              {
                                value: "_self",
                                name: "Same Tab/Window",
                              },
                              {
                                value: "_blank",
                                name: "New Tab/Window"
                              },
                            ]}
                            style={{maxWidth: 300}}
                          />
                          <Form.Item label="Order"   style={{maxWidth: 300}}>
                          {getFieldDecorator("order", { 
                            rules: [{ required: true, message: "Field required" }],
                            initialValue: orderMenuItem
                          })(
                          <InputNumber type={"number"} placeholder="Order"/>)}
                          </Form.Item>
                          <Select
                            label="Sub Menu Item"
                            form={props.form}
                            defaultValue={chilsMenuItem}
                            name="childs"
                            mode="multiple"
                            placeholder={"Sub Menu Item"}
                            dataSource={subMenuItems}
                            style={{maxWidth: 300}}
                          />
                           <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn info undefined"
                        loading={loadingButtonMenuItem}
                        style={{ marginTop: 15 }}
                      >
                        <span className="icon-save icon-padding-right"></span>
                        {<Translate id="text_save" />}
                      </Button>
                          </React.Fragment>
                          }
                        
                          </React.Fragment>)       
                      }
                     
                    </Form>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={"SEO"} key="seo">
                <Row>
                  <Col lg="4" md="4">
                    <Form onSubmit={onSeoSubmit}>
                      <InputText
                        data={metaTitle}
                        name="metaTitle"
                        label={<Translate id="text_meta_title" />}
                        placeholder={CATranslate(
                          "text_meta_title",
                          props.locale
                        )}
                        form={props.form}
                      />
                      <InputText
                        data={metaTagDescription}
                        name="metaTagDescription"
                        label={<Translate id="text_meta_tag_description" />}
                        placeholder={CATranslate(
                          "text_meta_tag_description",
                          props.locale
                        )}
                        form={props.form}
                      />
                      <InputText
                        data={metaTagKeyword}
                        name="metaTagKeyword"
                        label={<Translate id="text_meta_tag_keyword" />}
                        placeholder={CATranslate(
                          "text_meta_tag_keyword",
                          props.locale
                        )}
                        form={props.form}
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn info undefined"
                        loading={loadingButtonSeo}
                        style={{ marginTop: 15 }}
                      >
                        <span className="icon-save icon-padding-right"></span>
                        {<Translate id="text_save" />}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={"Social Media"} key="social_media">
                <Row>
                  <Col lg="4" md="4">
                    <Form onSubmit={onSocialMediaSubmit}>
                      <InputText
                        data={facebook}
                        name="facebook"
                        label={<Translate id="text_facebook" />}
                        placeholder={CATranslate("text_facebook", props.locale)}
                        form={props.form}
                      />
                      <InputText
                        data={instagram}
                        name="instagram"
                        label={<Translate id="text_instagram" />}
                        placeholder={CATranslate(
                          "text_instagram",
                          props.locale
                        )}
                        form={props.form}
                      />
                      <InputText
                        data={youtube}
                        name="youtube"
                        label={<Translate id="text_youtube" />}
                        placeholder={CATranslate("text_youtube", props.locale)}
                        form={props.form}
                      />
                      <InputText
                        data={telegram}
                        name="telegram"
                        label={<Translate id="text_telegram" />}
                        placeholder={CATranslate("text_telegram", props.locale)}
                        form={props.form}
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ant-btn info undefined"
                        loading={loadingButtonSocialMedia}
                        style={{ marginTop: 15 }}
                      >
                        <span className="icon-save icon-padding-right"></span>
                        {<Translate id="text_save" />}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </TabPane>       
            </Tabs>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

function UploadImage({ uploadProps, label, form, name }) {
  const { getFieldDecorator } = form;
  return (
    <div className="clearfix main-upload">
      <Form.Item className="wrap-upload" label={label}>
        {getFieldDecorator(name)(
          <Upload {...uploadProps} style={{ height: "120px" }}>
            {uploadProps.fileList.length === 0 ? (
              <React.Fragment>
                <UploadButton />
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </React.Fragment>
            ) : null}
          </Upload>
        )}
      </Form.Item>
    </div>
  );
}

function UploadImageBanner({
  form,
  name,
  fileList,
  util,
  index,
  onChangeImageName,
}) {
  const { getFieldDecorator } = form;
  const uploadProps = {
    listType: "picture-card",
    onRemove: (file) => {
      axios({
        method: "DELETE",
        url: `${util.getAPIURL()}/file/v1/delete`,
        data: { path: `website/banner/${file.name}` },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${util.getAccessToken()}`,
        },
      }).then(() => {
        onChangeImageName(null, index);
        form.setFieldsValue({ [`image${index}`]: null });
      });
    },
    beforeUpload: (file) => {
      return false;
    },
    fileList,
    onChange: ({ fileList, file }) => {
      let formData = new FormData();
      formData.append("image", file);
      if (file.status !== "removed") {
        axios
          .post(`${util.getAPIURL()}/file/v1/upload/web_banner`, formData, {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${util.getAccessToken()}`,
            },
          })
          .then((response) => {
            onChangeImageName(
              {
                uid: `${Date.now()}`,
                name: response.data.originalname,
                status: "done",
                url: response.data.location,
              },
              index
            );
          });
      }
    },
  };
  return (
    <div className="clearfix main-upload">
      <Form.Item className="wrap-upload">
        {getFieldDecorator(name)(
          <Upload {...uploadProps} style={{ height: "120px" }}>
            {uploadProps.fileList.length === 0 ? (
              <React.Fragment>
                <UploadButton />
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </React.Fragment>
            ) : null}
          </Upload>
        )}
      </Form.Item>
    </div>
  );
}

const UploadButton = () => (
  <div>
    <span className="icon-upload"></span>
    <div className="ant-upload-text">
      <div className="upload-extension-title">. JPG . PNG . GIF</div>
      <div className="upload-file-title">
        You can also upload files by <br />
        <span>clicking here </span>
      </div>
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form,
  };
}

const websiteSetting = Form.create(mapPropsToFields)(WebsiteSetting);

export default connect(mapStateToProps)(websiteSetting);
