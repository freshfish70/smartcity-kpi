const kpi = {
  name: 'Ålesund',
  children: [
    {
      name: 'society',
      children: [
        {
          name: 'education',
          children: [
            { name: 'students ict access', value: 0 },
            { name: 'school entrollments', value: 0 },
            { name: 'higher education degrees', value: 0 },
            { name: 'adult literacy', value: 0 },
          ],
        },
        {
          name: 'health',
          children: [
            { name: 'electronic health record', value: 0 },
            { name: 'life expectancy', value: 0 },
            { name: 'maternal mortality rate', value: 0 },
            { name: 'doctors', value: 0 },
            { name: 'health insurance coverage', value: 0 },
            { name: 'in-patient hospital beds', value: 0 },
          ],
        },
        {
          name: 'culture',
          children: [
            { name: 'cultural expenditure', value: 0 },
            { name: 'cultural infrastructure', value: 0 },
          ],
        },
        {
          name: 'housing',
          children: [
            { name: 'informal settlements', value: 0 },
            { name: 'housing expenditure', value: 0 },
          ],
        },
        {
          name: 'social inclusion',
          children: [
            { name: 'gender income equity', value: 0 },
            { name: 'gini coefficient', value: 0 },
            { name: 'poverty', value: 0 },
            { name: 'voter participation', value: 0 },
            { name: 'child care availability', value: 0 },
          ],
        },
        {
          name: 'safety',
          children: [
            { name: 'natural disaster related deaths', value: 0 },
            { name: 'disaster related economic losses', value: 0 },
            { name: 'resilience plans', value: 0 },
            { name: 'at risk population', value: 0 },
            { name: 'Emergency service response time', value: 0 },
            { name: 'police service', value: 0 },
            { name: 'fire service', value: 0 },
            { name: 'violent crime rate', value: 0 },
            { name: 'transportation fatalities', value: 0 },
          ],
        },
        {
          name: 'food security',
          children: [{ name: 'local food production', value: 0 }],
        },
      ],
    },
    {
      name: 'economy',
      children: [
        {
          name: 'ict infrastructure',
          children: [
            { name: 'household internet access', value: 0 },
            { name: 'fixed broadband subscription', value: 0 },
            { name: 'wireless broadband subscription', value: 0 },
            { name: 'wireless broadband coverage 3G', value: 0 },
            { name: 'wireless breoadban coverage 4G', value: 0 },
            { name: 'availability of wifi in public areas', value: 0 },
          ],
        },
        {
          name: 'water and sanitation',
          children: [
            { name: 'smart water meters', value: 0 },
            { name: 'water supply ict monitoring', value: 0 },
            { name: 'basic water supply', value: 0 },
            { name: 'potable water supply', value: 0 },
            { name: 'water supply loss', value: 0 },
            { name: 'wastewater collection', value: 0 },
            { name: 'household sanitation', value: 0 },
          ],
        },
        {
          name: 'drainage',
          children: [
            { name: 'drainage / storm water system ict monitoring', value: 0 },
          ],
        },
        {
          name: 'electricity supply',
          children: [
            { name: 'smart electricity meters', value: 0 },
            { name: 'electricity supply ict monitoring', value: 0 },
            { name: 'demand response penetration', value: 0 },
            { name: 'electricity system outage requency', value: 0 },
            { name: 'electricity system outage time', value: 0 },
            { name: 'access to electricity', value: 0 },
          ],
        },
        {
          name: 'transport',
          children: [
            { name: 'dynamic public transport information', value: 0 },
            { name: 'traffic monitoring', value: 0 },
            { name: 'intersection control', value: 0 },
            { name: 'public transit network', value: 0 },
            { name: 'public transit network convenience', value: 0 },
            { name: 'bicycle network', value: 0 },
            { name: 'private vehicles', value: 0 },
            { name: 'public transport', value: 0 },
            { name: 'walking', value: 0 },
            { name: 'cycling', value: 0 },
            { name: 'paratransport', value: 0 },
            { name: 'travel time index', value: 0 },
            { name: 'shared bicycles', value: 0 },
            { name: 'shared vehicles', value: 0 },
            { name: 'low-carbon emission passanger vehicles', value: 0 },
          ],
        },
        {
          name: 'public service',
          children: [
            { name: 'open data sets published', value: 0 },
            { name: 'open data sets %', value: 0 },
            { name: 'e-government', value: 0 },
            { name: 'public sector e.procurement', value: 0 },
          ],
        },
        {
          name: 'innovation',
          children: [
            { name: 'R&D expenditure', value: 0 },
            { name: 'patents', value: 0 },
            { name: 'small and medium sized enterprises', value: 0 },
          ],
        },
        {
          name: 'employment',
          children: [
            { name: 'unemployment rate', value: 0 },
            { name: 'youth unemployment rate', value: 0 },
            { name: 'tourism industry employment', value: 0 },
            { name: 'ict industry employment', value: 0 },
          ],
        },
        {
          name: 'waste',
          children: [{ name: 'solid waste collection', value: 0 }],
        },
        {
          name: 'buildings',
          children: [
            { name: 'public building sustanability', value: 0 },
            { name: 'integrated building management systems', value: 0 },
          ],
        },
        {
          name: 'urban planning',
          children: [
            { name: 'pedestrain infastructure', value: 0 },
            { name: 'urban development and spatial planning', value: 0 },
          ],
        },
      ],
    },
    {
      name: 'environment',
      children: [
        {
          name: 'air quality',
          children: [
            { name: 'air pollution PM2.5', value: 0 },
            { name: 'air pollution PM10', value: 0 },
            { name: 'air pollution N02', value: 0 },
            { name: 'air pollution S02', value: 0 },
            { name: 'air pollution 03', value: 0 },
            { name: 'ghg emission', value: 0 },
          ],
        },
        {
          name: 'waster and sanitation',
          children: [
            { name: 'water quality', value: 0 },
            { name: 'water consumption', value: 0 },
            { name: 'fresh water consumption', value: 0 },
            { name: 'wastewater treated: primary', value: 0 },
            { name: 'wastewater treated: secondary', value: 0 },
            { name: 'wasterwater treated: tertiary', value: 0 },
          ],
        },
        {
          name: 'waste',
          children: [
            { name: 'landfill', value: 0 },
            { name: 'burnt', value: 0 },
            { name: 'incinerated', value: 0 },
            { name: 'recycled', value: 0 },
            { name: 'other', value: 0 },
            { name: 'open dump', value: 0 },
          ],
        },
        {
          name: 'environment quality',
          children: [
            { name: 'emf exposure', value: 0 },
            { name: 'exposure to noise', value: 0 },
          ],
        },
        {
          name: 'public space and nature',
          children: [
            { name: 'green areas', value: 0 },
            { name: 'green area accessibility', value: 0 },
            { name: 'protected areas', value: 0 },
            { name: 'recreational facilities', value: 0 },
          ],
        },
        {
          name: 'energy',
          children: [
            { name: 'renewable energy consumption', value: 0 },
            { name: 'electricity consumption', value: 0 },
            { name: 'residential thermal energy consumption', value: 0 },
            { name: 'public building energy consumption', value: 0 },
          ],
        },
      ],
    },
  ],
}
