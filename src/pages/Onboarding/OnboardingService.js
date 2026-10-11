import BaseService from "../../app/modules/common/services/BaseService";

class OnboardingService extends BaseService {
  constructor() {
    super();
    this.onboardingUrl = `${this.baseUrl}/onboarding`;
    this.locationUrl = `${this.baseUrl}/locations`;
  }

  getStatus() {
    this.setHeader();
    return this.GET({ url: `${this.onboardingUrl}/status`, headers: this.header });
  }

  updateCostCalculation(method) {
    this.setHeader();
    return this.PUT({
      url: `${this.onboardingUrl}/cost-calculation`,
      data: { method },
      headers: this.header
    });
  }

  updateCurrency(code) {
    this.setHeader();
    return this.PUT({
      url: `${this.onboardingUrl}/currency`,
      data: { code },
      headers: this.header
    });
  }

  getChecklist() {
    this.setHeader();
    return this.GET({ url: `${this.onboardingUrl}/checklist`, headers: this.header });
  }

  getPreset(businessType) {
    this.setHeader();
    return this.GET({
      url: `${this.onboardingUrl}/business-types/${encodeURIComponent(businessType)}/preset`,
      headers: this.header
    });
  }

  getLocation(locationId) {
    this.setHeader();
    return this.GET({ url: `${this.locationUrl}/${encodeURIComponent(locationId)}`, headers: this.header });
  }

  updateLocation(locationId, location) {
    this.setHeader();
    return this.PUT({
      url: `${this.locationUrl}/${encodeURIComponent(locationId)}`,
      data: location,
      headers: this.header
    });
  }

  complete() {
    this.setHeader();
    return this.POST({ url: `${this.onboardingUrl}/complete`, data: {}, headers: this.header });
  }
}

export function getResponseData(response) {
  const body = response && response.data;
  return body && body.data !== undefined ? body.data : body;
}

export default new OnboardingService();
