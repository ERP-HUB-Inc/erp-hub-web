import React from "react";
import Modal from "../../../../common/components/shares/Modal";
import "./ProductTypeList.css";
export default class ProductTypeList extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_all_category" />;
    this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this);
  }

  renderCrudAction() {
  }

  handleCancel() {
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  }

  handleOnSelectCategory(categoryId) {
    this.props.handleOnSelectCategory(categoryId);
    this.props.handleCancel();
  }

  render() {

    const categories = [];
    this.props.list.forEach(category => {
      categories.push({
        id: category.id,
        name: "productTypeDescriptions" in category && category["productTypeDescriptions"].length > 0 ?
          category["productTypeDescriptions"][0].name
          :
          category.name
      });
    });

    this.content = <this.Row className="wrap-all-category">
      {
        this.Util.orderBy(categories, ["name"]).map((category, index) => 
          <this.Col md="3" className="category-box" key={index}>
            <div className="category" onClick={() => this.handleOnSelectCategory(category.id)}>
              <div style={{maxHeight: 20, overflow: "hidden", wordBreak: "break-all"}}>
                <div>
                  {category.name}
                </div>
              </div>
            </div>
          </this.Col>
        )
      }
    </this.Row>;
    return super.render();
  }
}

ProductTypeList.defaultProps = {
  list: []
};