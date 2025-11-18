import React from 'react';
import SEO from '../../components/Seo';

const Calendar = () => (
  <>
    <SEO
      title="Calendar"
      description="My Google Calendar - Schedule and availability"
      path="/calendar"
      keywords={['calendar', 'schedule', 'availability']}
    />
    <div className="marginTopTitle">
      <h1 className="titleSeparate">My Calendar</h1>
    </div>
    <div style={{ 
      marginTop: '20px',
      marginBottom: '40px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        paddingBottom: '75%', // 4:3 aspect ratio (600/800 = 0.75)
        height: 0,
        overflow: 'hidden'
      }}>
        <iframe 
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&showTitle=0&showCalendars=0&showTz=0&mode=WEEK&src=YmVuaGFvaEBhbmRyZXcuY211LmVkdQ&color=%23039be5" 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'solid 1px #777'
          }} 
          frameBorder="0" 
          scrolling="no"
          title="Google Calendar"
        />
      </div>
    </div>
  </>
);

export default Calendar;
