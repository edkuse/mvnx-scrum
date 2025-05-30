CREATE TABLE applications (
    itap_id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    acronym VARCHAR(25) NOT NULL,
    mots_id INT,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    it_owner VARCHAR(10),
    it_owner_alt VARCHAR(10),
    install_status VARCHAR(25),
    lifecycle_status VARCHAR(25),
    install_type VARCHAR(25),
    app_type VARCHAR(25),
    business_purpose VARCHAR(25),
    business_unit VARCHAR(50),
    business_owner VARCHAR(10)
);

INSERT INTO applications (name, acronym, itap_id, mots_id, description, active, it_owner, install_status, lifecycle_status, install_type, app_type, business_purpose, business_unit, it_owner_alt, business_owner) VALUES
('MVNX Aime', 'mvnx-aime', 'APM0046380', 35814, 'Connex-AIME application provides a various capabalities for testing, reporting, alarming and observability in general. Connex-AIME provides easy and convenient interconnection to ServiceNow, OpenSearch, Snowflake, VTM, Webphone, CSI and much more, ensuring seamless integration and enhanced productivity for all users.', true, 'ek2842', 'In Production', 'Operational', 'Cloud', 'Homegrown', 'Tool', 'AT&T MOBILITY', 'lv6796', 'jt2152'),
('MVNx Core', 'MVNx-Core', 'APM0046479', 35913, 'MVNx Core is ETL service and API that serves applications across the MVNx Organization as SSoT, and provides ability to access data of other applications through unified interface. It supports access to Postgres and MongoDB type instances, Azure Blob using SAS tokens and provides shared interface for functionality related to application compliance.', false, 'md769c', 'Cancelled', 'Inventory', null, 'Homegrown', 'Application', 'AT&T MOBILITY', 'mp3702', 'jt2152'),
('MVNx Identity', 'mvnxid', 'APM0046611', 36045, 'MVNx Identity is authorization platform to manage user identity across the MVNx / ConnEx suite of products. It serves as single source of truth on user data and connects the experience between platforms together. Further it provides mechanized identity management to integrate with MVNx products, giving admins ability to create keys for system to system communication and manage their lifecycle.', true, 'md769c', 'In Production', 'Operational', 'Cloud', 'Homegrown', 'Tool', 'AT&T MOBILITY', 'ap503j', 'md769c'),
('MVNX Ihub', 'mvnx-ihub', 'APM0046361', 35795, 'mvnx iHUB was initially created as a bridge between Legacy CSI APIs and other Connex applications such as AIME. It allows developers to connect to the CSI API using REST, which saves a lot of time and reduces complexity. At this moment, Connex iHUB not only contains SOAP to REST functionality but also allows developers to easily use TMF APIs and other services like OpenSearch, Ericsson, or Webphone.', true, 'ap503j', 'In Production', 'Operational', 'Cloud', 'Homegrown', 'Application', 'AT&T MOBILITY', 'lv6796', 'ap503j'),
('MVNx Landing Page', 'MVNXHI', 'APM0046816', 36248, 'MVNx Landing Page is a static website that will serve as the entry point to the CatalyX platform, providing links to all MVNx tools, onboarding status updates for eligible products, and a support section with contact info for assigned personnel. It ensures easy navigation, transparency, and personalized assistance.', true, 'mp3702', 'Implementing', 'Design', null, 'Homegrown', 'Application', 'AT&T MOBILITY', 'md769c', 'mp3702'),
('MVNX Platform ', 'MVNXP', 'APM0016172', 32404, 'MVNX is a robust cloud-based platform designed for seamless infrastructure services. Its sub-platforms include LaunchPad for deployment, ServiceDesk for support, Identity for secure access, Reliability for uptime, and AIME for intelligent monitoring. Elevate your operations with MVNX!', true, 'ek2842', 'In Production', 'Operational', 'Cloud', 'Homegrown', 'Tool', 'AT&T MOBILITY', 'pl4715', 'jt2152'),
('MVNx Service Desk', 'mvnx-servicedesk', 'APM0046699', 36133, 'MVNx Service Desk is an advanced case management and service analytics dashboard designed to streamline the management of daily operational issues affecting Mobile Virtual Network Operators (MVNOs). Built on the robust and scalable Microsoft Azure infrastructure, MVNx Service Desk offers real-time data processing and analytics, enabling swift identification and resolution of service disruptions. With its intuitive user interface and comprehensive reporting capabilities, the application empowers MVNOs to enhance operational efficiency, improve service delivery, and make data-driven decisions. The Azure backbone ensures high availability, security, and seamless integration with other cloud services, making MVNx Service Desk an indispensable tool for managing complex telecom operations.', true, 'pl4715', 'Implementing', 'Design', 'Cloud', 'Homegrown', 'Application', 'AT&T MOBILITY', 'md769c', 'md769c'),
('MVNx TMF APIs', 'mvnx-tmf', 'APM0046142', 35433, 'Set of standardized telecom APIs based on TMForum standards, that drive reliability (TMF642 - Alarming), observability (TMF688 - Event Management) and better user experience across MVNx applications by providing unified API structure that is modular & easily extensible.', false, 'md769c', 'Retired', 'Inventory', null, 'Homegrown', 'Application', 'AT&T MOBILITY', 'ap503j', 'md769c'),
('MVNX Website', 'mvnx-web', 'APM0045474', 34219, 'MVNX website is a sales landing page detailing the MVNX suite of products - ConneX, Developer Platform and Innovation Lab. It hosts articles (statically generated during build), product information pages and allows for capturing leads via contact form.', true, 'md769c', 'In Production', 'Operational', 'Cloud', 'Homegrown', 'Tool', 'AT&T MOBILITY', 'mp3702', 'jt2152');

