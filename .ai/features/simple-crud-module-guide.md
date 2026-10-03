# Simple CRUD Module Guide

Use this guide when implementing or fixing a simple CRUD module in this project, especially modules that should follow the `Vendors` page style.

Reference implementation:

- `src/pages/Purchasing/Vendors`
- `src/pages/Purchasing/Vendors/form/index.jsx`
- `src/pages/Setting/Modules/Category`

## Goal

Build a simple list/create/update/delete module that:

- uses the existing Redux action/reducer/service pattern
- uses the Vendors-style list page layout
- supports search, pagination, sorting, create, update, and delete
- does not change backend API contracts
- keeps edits scoped to the target module unless a shared fix is clearly required

## Expected Folder Structure

```text
src/pages/<Area>/<Module>/
  index.jsx
  form.create.jsx
  form.update.jsx
  form/
    index.jsx
    form.create.jsx
    form.update.jsx
    form.item.jsx
  redux/
    action.js
    constant.js
```

## Page Container

`index.jsx` should connect list/add/update state and pass props into `form/index.jsx`.

Expected props:

- `list`
- `add`
- `update`
- `locale`

Example shape:

```jsx
function mapStateToProps(state) {
  return {
    list: state.reducer.<reducerName>.request,
    add: state.reducer.<reducerName>.add,
    update: state.reducer.<reducerName>.update,
    locale: state.locale
  };
}
```

If create/update modals need their own connected props, keep `form.create.jsx` and `form.update.jsx` as connected wrappers.

## Redux Action Pattern

When the service extends `src/services/BaseService.js`, call `get` with an options object, not positional arguments.

Correct:

```js
fetch: (limit, offset, sortField, sortOrder, filter, search) => {
  return dispatch => {
    return dispatch({
      type: Constant.REQUEST_MODULE,
      payload: ModuleService.get({ limit, offset, sortField, sortOrder, filter, search })
    });
  };
}
```

Incorrect:

```js
payload: ModuleService.get(limit, offset, sortField, sortOrder)
```

Use existing service methods:

- `get({ limit, offset, sortField, sortOrder, filter, search })`
- `getById(id)`
- `add(data)`
- `update(data)`
- `archive(ids)`

## Vendors-Style List Page

In `form/index.jsx`, extend `@layout/datatable`, but override `render()` to follow the Vendors page structure.

Use:

- `PageHeader` from `@components/PageHeader`
- `Row`, `Col`, `Input`, `Icon`, `Table` from `@components/index`
- padded table content area: `paddingLeft: 40`, `paddingRight: 40`, `paddingTop: 25`
- table `bordered`
- Ant table pagination object
- search input above table
- header action button for create

Basic render structure:

```jsx
render() {
  const fetchingProps = this.props[this.fetchingProp];
  const rowSelection = {
    selectedRowKeys: this.state.selectedRowKeys,
    onChange: this.onSelectChange,
    getCheckboxProps: record => ({
      name: record.name
    })
  };

  return (
    <div className="content-list">
      <div className="table-wrapper">
        <PageHeader
          title="Module Name"
          subtitle="Manage module records"
          breadcrumbs={[
            { text: "Dashboard", href: "/dashboard" },
            { text: "Module Name" }
          ]}
          actions={[
            {
              text: "New Record",
              type: "primary",
              icon: "plus",
              onClick: this.handleShowFormAdd
            }
          ]}
        />

        <div style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 25 }}>
          <Row style={{ marginBottom: 10 }}>
            <Col md={24}>
              <Input
                name="search"
                placeholder={this.placeholder}
                suffix={<Icon type="search" />}
                style={{ width: 380, marginRight: 10 }}
                allowClear={true}
                onChange={this.onSearch}
              />
            </Col>
          </Row>

          <Table
            rowKey="id"
            bordered
            rowSelection={rowSelection}
            loading={fetchingProps.fetching}
            columns={this.columns}
            dataSource={fetchingProps.list}
            onChange={this.onChange}
            onRow={record => ({
              onDoubleClick: () => this.handleShowFormEdit(record),
              onClick: event => this.handleOnTapHandler(event, record)
            })}
            pagination={{
              total: fetchingProps.pagination.total,
              pageSize: fetchingProps.pagination.limit,
              current: this.state.current,
              pageSizeOptions: this.pageSizeOptions,
              showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
              showSizeChanger: true,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onChangePagination
            }}
            locale={{ emptyText: <this.Translate id="table_empty_data" /> }}
            size="middle"
          />
        </div>

        {this.formCreate}
        {this.formUpdate}
        {this.renderModalConfirmDelete()}
      </div>
    </div>
  );
}
```

## Required Constructor Setup

In the page class constructor:

```jsx
this.title = "Module Name";
this.placeholder = "Search records...";
this.formCreate = <FormCreate />;
this.formUpdate = <FormUpdate />;
this.service = ModuleService;
this.action = ModuleAction;
this.RESET_CONSTANT = Constant.RESET_MODULE;
this.columnFilterWithKey = ["name"];
this.searchTimer = null;
this.handleShowFormEdit = this.showFormEdit.bind(this);
```

Use columns that display the most useful fields. Always include the action column:

```jsx
this.columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  }
].concat([this.renderActionColumn()]);
```

## Search Pattern

Use debounce and dispatch through the module action.

```jsx
onSearch = event => {
  const value = event.target.value;
  clearTimeout(this.searchTimer);
  this.searchTimer = setTimeout(() => {
    const searchKey = value ? JSON.stringify({ column: this.columnFilterWithKey, value }) : "";
    this.props.dispatch(this.action.fetch(this.pageSize, 0, "", "", "", searchKey));
    this.setState({ current: 1 });
  }, 300);
}

componentWillUnmount() {
  clearTimeout(this.searchTimer);
}
```

## Create Flow

The create wrapper `form.create.jsx` should connect the add reducer state and wrap `form/form.create.jsx`.

The create modal should:

- use `BaseModal`
- validate fields with `validateFieldsAndScroll`
- dispatch `Action.add(values)`
- reset add state on cancel
- render only when `add.showForm` is true

Keep image upload handling only if the module actually has image fields.

## Update Flow

The update wrapper `form.update.jsx` should connect:

- update reducer state
- detail reducer state
- locale

The update modal should:

- use `BaseModal`
- use `detail.data` as `formData`
- set `values.id = detail.data.id`
- dispatch `Action.update(values)`
- reset detail state on cancel
- render only when `detail.showForm` is true

The list page edit handler should request the latest detail before showing the update modal:

```jsx
showFormEdit(rowData) {
  this.props.dispatch(ModuleAction.requestAndShowForm(rowData));
}
```

## Delete Flow

The shared row action menu can call `handleConfirm(record)`. Override it so row-level delete works even when table checkbox selection is not the primary path.

```jsx
handleConfirm(rowData) {
  if (rowData && rowData.id) {
    this.setState({
      selectedListIds: [rowData.id],
      selectedRowKeys: [rowData.id],
      modalVisible: true
    });
    return;
  }

  super.handleConfirm();
}
```

The shared `handleDelete` uses `this.service.archive(this.state.selectedListIds)`.

## Refresh After Create / Update

After create or update succeeds:

```jsx
componentWillUpdate(nextProps) {
  if (nextProps.add.added || nextProps.update.updated) {
    this.props.dispatch(ModuleAction.reset());
    this.props.dispatch(ModuleAction.reset(Constant.RESET_DETAIL_MODULE));
    this.props.dispatch(this.action.fetch(this.pageSize));
  }
}
```

Use the module's actual reset constants.

## Form Item Rules

Use the existing form components from `BaseModal` / modal base classes:

- `this.InputText`
- `this.InputEmail`
- `this.InputTextArea`
- `this.Select`
- `this.UploadImg`
- `this.Row`
- `this.Col`

Required text input pattern:

```jsx
<this.InputText
  name="name"
  label={<this.Translate id="text_name" />}
  data={formData.name}
  placeholder={this.CATranslate("text_name", this.props.locale)}
  errorRequired={<this.Translate id="error_require_name" />}
  required={true}
  isAutoFocus={true}
  max={100}
  form={this.props.form}
/>
```

For dropdown data from services, call services using an options object:

```js
CategoryService.get({ limit: 50 })
```

## Common Pitfalls To Check

- Do not call `Service.get(limit, offset)` if that service expects `get({ limit, offset })`.
- Make sure create and update modal wrapper components are mounted in the list render.
- Make sure edit uses `requestAndShowForm(rowData)` if the update form needs latest detail data.
- Make sure row delete receives the clicked row id, not only selected checkbox ids.
- Make sure search uses the correct API search shape:

```js
JSON.stringify({ column: ["name"], value })
```

- Make sure table `rowKey` matches the API record id, usually `id`.
- Make sure `pagination.total`, `pagination.limit`, and `current` come from reducer/list state.
- Do not rewrite unrelated shared components unless a shared bug is clearly blocking the feature.
- Watch for hardcoded copy copied from another module, such as `New Vendor`.

## Validation

At minimum, run a parser check for edited JSX:

```bash
node -e "const fs=require('fs'); const parser=require('@babel/parser'); ['path/to/file.jsx'].forEach(file=>{parser.parse(fs.readFileSync(file,'utf8'), {sourceType:'module', plugins:['jsx','classProperties']}); console.log(file + ' parsed OK');});"
```

Then run ESLint if the repo has all plugins installed:

```bash
npx eslint path/to/file.jsx
```

If ESLint fails because a plugin is missing from the local install, report that clearly.

## Manual Test Checklist

- Open the module page.
- List loads with pagination.
- Search filters the list.
- Clicking `New <Module>` opens the create modal.
- Required validation blocks invalid submit.
- Create succeeds and refreshes the list.
- Double-clicking a row or clicking Edit opens update modal with existing data.
- Update succeeds and refreshes the list.
- Delete from row action opens confirmation.
- Confirm delete archives/removes the record and refreshes the list.
- Pagination and page-size changes still fetch data.
- Sorting still fetches data where supported by the API.
