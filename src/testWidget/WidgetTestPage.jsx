import React from 'react';

const WidgetTestPage = () => {
  React.useEffect(() => {
    const widgetConfig = {
      mountId: 'diniiz-widget',
      locationId: 'AB002L1'
    };

    const mountDiv = document.createElement('div');
    mountDiv.id = widgetConfig.mountId;
    document.body.appendChild(mountDiv);

    const script = document.createElement('script');
    script.src = '/src/widget/index.jsx';
    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <h1>Widget Test Page</h1>
      <p>If working, you should see the widget button in bottom-right corner.</p>
    </div>
  );
};

export default WidgetTestPage;