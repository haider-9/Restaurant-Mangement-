import WidgetEntry from '../components/reservationwidgets/WidgetEntry';

// Simple component that matches your working example
function WidgetContainer({ locationId }) {
  return (
    <div >
      <WidgetEntry locationId={locationId} />
    </div>
  );
}

// Global initialization function
window.DiniizWidget = {
  init: function(locationId) {
    const container = document.getElementById('diniiz-widget-container');
    if (!container) {
      console.error('Container element not found');
      return;
    }
    
    const root = window.ReactDOM.createRoot(container);
    root.render(
      <window.React.StrictMode>
        <WidgetContainer locationId={locationId} />
      </window.React.StrictMode>
    );
  }
};