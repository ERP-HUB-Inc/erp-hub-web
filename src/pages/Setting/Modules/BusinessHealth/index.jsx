import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Form, InputNumber, Modal, Spin, Tag, message } from 'antd';
import { ChevronRight, RefreshCw } from 'lucide-react';
import Util from '@helper/util';
import BusinessHealthPolicyService from '@services/BusinessHealthPolicyService';
import { isPolicyConflict, policyError, readPolicy } from './model';
import '../Category/form/listing.css';
import './style.css';

export class BusinessHealthPage extends React.Component {
  state = { loading: true, loaded: false, policy: null, loadError: '', saveError: '', notice: '', saving: false, disableOpen: false, writeDenied: false };
  loadRequest = 0;
  componentDidMount() { this.load(); }
  componentWillUnmount() { this.unmounted = true; this.loadRequest++; }

  canWrite = () => {
    const user = (new Util()).getCurrentUser() || {};
    return Number(user.isFullAccess) === 1 && !this.state.writeDenied;
  };

  applyPolicy = policy => {
    this.setState({ policy });
    this.props.form.setFieldsValue({
      healthyCoveragePercent: policy ? policy.healthyCoveragePercent : 100,
      criticalBelowCoveragePercent: policy ? policy.criticalBelowCoveragePercent : 50
    });
  };

  load = async () => {
    const request = ++this.loadRequest;
    this.setState({ loading: true, loaded: false, loadError: '', saveError: '', disableOpen: false });
    try {
      const policy = readPolicy(await BusinessHealthPolicyService.get());
      if (this.unmounted || request !== this.loadRequest) return;
      this.applyPolicy(policy);
      this.setState({ loading: false, loaded: true });
    } catch (error) {
      if (!this.unmounted && request === this.loadRequest) this.setState({ loading: false, loadError: policyError(error, 'Unable to load the business health policy.') });
    }
  };

  handleWriteError = async error => {
    if (this.unmounted) return;
    if (isPolicyConflict(error)) {
      this.setState({ saving: false, disableOpen: false, notice: 'The policy changed. The latest policy has been requested. Review the loaded thresholds and status before trying again.' });
      await this.load();
      return;
    }
    // A failed or unreadable write may have reached the server. Version conflicts
    // are resolved by reloading, never by automatically repeating the write.
    this.setState({ saving: false, saveError: policyError(error, 'Unable to save the business health policy.'),
      writeDenied: Boolean(error && error.response && error.response.status === 403) || this.state.writeDenied });
  };

  submit = event => {
    if (event) event.preventDefault();
    const { saving, loading, loaded, policy } = this.state;
    if (!this.canWrite() || saving || loading || !loaded) return;
    this.props.form.validateFieldsAndScroll(async (error, values) => {
      if (error) return;
      this.setState({ saving: true, saveError: '', notice: '' });
      try {
        const payload = { healthyCoveragePercent: values.healthyCoveragePercent, criticalBelowCoveragePercent: values.criticalBelowCoveragePercent };
        const response = policy
          ? await BusinessHealthPolicyService.update({ ...payload, expectedVersion: policy.version })
          : await BusinessHealthPolicyService.add(payload);
        const saved = readPolicy(response, false);
        if (!saved.enabled) throw new Error('The policy was not enabled. Reload before trying again.');
        if (this.unmounted) return;
        this.applyPolicy(saved);
        this.setState({ saving: false });
        message.success(policy ? policy.enabled ? 'Business health policy updated.' : 'Business health policy re-enabled.' : 'Business health policy created.');
      } catch (failure) { await this.handleWriteError(failure); }
    });
  };

  disable = async () => {
    const { policy, saving, loaded, loading } = this.state;
    if (!this.canWrite() || !loaded || loading || saving || !policy || !policy.enabled) return;
    this.setState({ saving: true, saveError: '', notice: '' });
    try {
      const saved = readPolicy(await BusinessHealthPolicyService.disable(policy.version), false);
      if (saved.enabled) throw new Error('The policy was not disabled. Reload before trying again.');
      if (this.unmounted) return;
      this.applyPolicy(saved);
      this.setState({ saving: false, disableOpen: false });
      message.success('Business health policy disabled.');
    } catch (error) { await this.handleWriteError(error); }
  };

  render() {
    const s = this.state;
    const canWrite = this.canWrite();
    const locked = !canWrite || s.loading || !s.loaded || s.saving;
    const { getFieldDecorator } = this.props.form;
    return <main className="category-listing business-health-settings">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Business Health Configuration</strong></nav>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Business Health Configuration</h1></div><p>Set the coverage thresholds used to assess business health.</p></div>
        <Button className="category-listing-refresh-button" loading={s.loading} disabled={s.saving || s.loading} onClick={this.load}>
          {!s.loading && <RefreshCw size={14} aria-hidden="true" />}<span>Reload policy</span>
        </Button>
      </header>
      {s.notice && <Alert type="warning" showIcon role="alert" message={s.notice} />}
      {s.loadError && <Alert type="error" showIcon role="alert" message={s.loadError} description={<Button onClick={this.load}>Retry</Button>} />}
      {s.saveError && <Alert type="error" showIcon role="alert" message={s.saveError} />}
      {s.loading && <div role="status"><Spin size="small" /> Loading business health policy…</div>}
      <section className="business-health-policy-card" aria-label="Business health policy" hidden={!s.loaded}>
        <div className="business-health-policy-status"><h2>Coverage thresholds</h2><Tag color={s.policy && s.policy.enabled ? 'green' : undefined}>{s.policy ? s.policy.enabled ? 'Enabled' : 'Disabled' : 'Not configured'}</Tag></div>
        {s.loaded && !s.policy && <Alert type="info" showIcon message="No business health policy is configured." description="The suggested thresholds below will take effect when you create the policy." />}
        {s.policy && !s.policy.enabled && <Alert type="info" showIcon message="This policy is disabled. Its saved thresholds are retained." />}
        {!canWrite && <Alert type="info" showIcon message="Full business access is required to change or disable this policy. You can view the current settings." />}
        <Form layout="vertical" onSubmit={this.submit}>
          <Form.Item label="Healthy coverage (%)" htmlFor="health-healthy" extra="Coverage at or above this threshold is healthy. Minimum: 100%.">{getFieldDecorator('healthyCoveragePercent', {
            initialValue: 100,
            rules: [{ validator: (_, value, callback) => callback(typeof value === 'number' && Number.isFinite(value) && value >= 100 ? undefined : 'Enter a finite number of at least 100%.') }]
          })(<InputNumber id="health-healthy" min={100} disabled={locked} />)}</Form.Item>
          <Form.Item label="Critical below coverage (%)" htmlFor="health-critical" extra="Coverage below this threshold is critical. It must be lower than healthy coverage.">{getFieldDecorator('criticalBelowCoveragePercent', {
            initialValue: 50,
            rules: [{ validator: (_, value, callback) => callback(typeof value === 'number' && Number.isFinite(value) && value >= 0 && value < this.props.form.getFieldValue('healthyCoveragePercent') ? undefined : 'Enter a finite number from 0 up to, but below, healthy coverage.') }]
          })(<InputNumber id="health-critical" min={0} disabled={locked} />)}</Form.Item>
          {canWrite && <div className="business-health-policy-actions">
            <Button type="primary" htmlType="submit" loading={s.saving} disabled={locked}>{!s.policy ? 'Create Policy' : s.policy.enabled ? 'Save Changes' : 'Save & Re-enable'}</Button>
            {s.policy && s.policy.enabled && <Button type="danger" disabled={locked} onClick={() => this.setState({ disableOpen: true, saveError: '' })}>Disable Policy</Button>}
          </div>}
        </Form>
      </section>
      {s.disableOpen && <Modal visible title="Disable Business Health Policy?" okText="Disable Policy" okType="danger" onOk={this.disable}
        onCancel={() => { if (!s.saving) this.setState({ disableOpen: false }); }} confirmLoading={s.saving} maskClosable={false} closable={!s.saving} keyboard={!s.saving}
        cancelButtonProps={{ disabled: s.saving }} okButtonProps={{ disabled: s.saving || !canWrite }}>
        <p>This disables the policy and retains its saved thresholds. You can re-enable it later.</p>
        {s.saveError && <Alert type="error" showIcon role="alert" message={s.saveError} />}
      </Modal>}
    </main>;
  }
}

export default Form.create({ name: 'business-health-policy', fieldNameProp: null })(BusinessHealthPage);
