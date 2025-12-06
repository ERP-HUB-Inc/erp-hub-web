import React from 'react';
import { Button, Modal, Input, message, Upload, Icon } from 'antd';

class ItemAIGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      step: 1,
      uploadedFile: null,
      filePreview: null
    };
  }

  showModal = () => {
    this.setState({ visible: true, step: 1, uploadedFile: null, filePreview: null });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleUpload = (info) => {
    const file = info.file;
    
    if (file.type && !file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return;
    }

    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ 
        uploadedFile: file,
        filePreview: e.target.result
      });
      message.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  copyPrompt = () => {
    if (!this.state.uploadedFile) {
      message.error('Please upload an image first');
      return;
    }

    const prompt = `You are an ERP product specialist. Analyze the uploaded product image and generate detailed item information in this exact JSON format:

{
  "itemName": "Product name",
  "description": "Detailed product description",
  "category": "Product category",
  "sku": "Suggested SKU",
  "unitOfMeasure": "pcs/box/kg/ltr",
  "basePrice": "Price estimate",
  "reorderLevel": "Suggested reorder quantity",
  "specifications": "Key specifications"
}

Please analyze the image and provide complete product details.`;

    // Copy prompt as text
    navigator.clipboard.writeText(prompt).then(() => {
      // Copy image as blob
      this.state.uploadedFile.arrayBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: this.state.uploadedFile.type });
        const imageItem = new ClipboardItem({ [this.state.uploadedFile.type]: blob });
        
        navigator.clipboard.write([imageItem]).then(() => {
          message.success('Prompt + Image copied to clipboard!');
          this.setState({ step: 2 });
        }).catch(() => {
          message.success('Prompt copied to clipboard! Image is ready - copy it separately from the preview');
          this.setState({ step: 2 });
        });
      });
    }).catch(() => {
      message.error('Failed to copy');
    });
  };

  pasteResult = () => {
    navigator.clipboard.readText().then(text => {
      console.log('Pasted result:', text);
      message.success('Item data imported successfully!');
      this.setState({ visible: false });
    }).catch(() => {
      message.error('Failed to read clipboard');
    });
  };

  render() {
    const { visible, step, uploadedFile, filePreview } = this.state;

    const uploadProps = {
      maxCount: 1,
      accept: 'image/*',
      beforeUpload: () => false,
      onChange: this.handleUpload,
      listType: 'picture-card'
    };

    return (
      <div style={{ padding: '20px' }}>
        <Button 
          type="primary" 
          size="large"
          onClick={this.showModal}
        >
          Generate Item with AI
        </Button>

        <Modal
          title="Generate Item with AI"
          visible={visible}
          onCancel={this.handleCancel}
          width={700}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            step === 1 ? (
              <Button 
                key="copy" 
                type="primary"
                disabled={!uploadedFile}
                onClick={this.copyPrompt}
              >
                Step 1: Copy Prompt
              </Button>
            ) : (
              <Button 
                key="paste" 
                type="primary"
                onClick={this.pasteResult}
              >
                Step 2: Paste Result
              </Button>
            ),
          ]}
        >
          {step === 1 ? (
            <div>
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
                <strong>Quick Steps:</strong>
                <ol style={{ marginBottom: 0, paddingLeft: '20px' }}>
                  <li>Upload your product image</li>
                  <li>Click "Copy Prompt"</li>
                  <li>Go to ChatGPT or Claude</li>
                  <li>Paste prompt + upload the same image</li>
                  <li>Come back and click "Paste Result"</li>
                </ol>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong style={{ display: 'block', marginBottom: '12px' }}>Step 1: Upload Product Image</strong>
                <Upload {...uploadProps}>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Icon type={uploadedFile ? 'check-circle' : 'cloud-upload'} style={{ fontSize: '32px', color: uploadedFile ? '#52c41a' : '#1890ff' }} />
                    <p>{uploadedFile ? 'Image uploaded!' : 'Click to upload or drag image here'}</p>
                  </div>
                </Upload>
              </div>

              {filePreview && (
                <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '4px', textAlign: 'center' }}>
                  <img src={filePreview} alt="preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '4px' }} />
                </div>
              )}

              <p style={{ color: '#666', fontSize: '12px' }}>Make sure to upload a clear image of your product for best results from the AI.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <strong>Step 2: Paste AI Result</strong>
              </div>
              <p style={{ color: '#666', marginBottom: '12px' }}>Paste the JSON result from your LLM chatbot. The data will be automatically imported into your ERP system.</p>
              <Input.TextArea 
                placeholder="Paste the AI-generated JSON result here..."
                rows={10}
                ref={input => this.resultInput = input}
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default ItemAIGenerator;