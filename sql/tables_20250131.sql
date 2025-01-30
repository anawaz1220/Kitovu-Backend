create extension postgis;


CREATE TABLE farmer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID as primary key
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    alternate_phone_number VARCHAR(15),
    street_address TEXT NOT NULL,
    state VARCHAR(100),
    community VARCHAR(100),
    lga VARCHAR(100),
    city VARCHAR(100),
    farmer_picture TEXT NOT NULL,
    id_type VARCHAR(50) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    id_document_picture TEXT NOT NULL
);



select * from farmer_affiliation



CREATE TABLE farm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID as primary key
    farmer_id UUID NOT NULL REFERENCES farmer(id) ON DELETE CASCADE, -- Foreign key to farmer table
    farm_type VARCHAR(100) NOT NULL, -- Type of farm (e.g., Crop, Livestock, Mixed)
    ownership_status VARCHAR(50) NOT NULL, -- Ownership status (e.g., Owned, Leased)
    lease_years INT, -- Number of lease years (if applicable)
    lease_months INT, -- Number of lease months (if applicable)
    area NUMERIC(10, 2) NOT NULL, -- Total area of the farm (in hectares or acres)
    crop_type VARCHAR(100), -- Type of crop (if applicable)
    crop_area NUMERIC(10, 2), -- Area dedicated to crops (if applicable)
    livestock_type VARCHAR(100), -- Type of livestock (if applicable)
    number_of_animals INT, -- Number of animals (if applicable)
    farm_latitude DOUBLE PRECISION, -- Latitude of the farm (6 decimal places)
    farm_longitude DOUBLE PRECISION, -- Longitude of the farm (6 decimal places)
    farm_geometry GEOMETRY(Polygon, 4326) -- Polygon geometry for the farm (using WGS 84 SRID)
);


CREATE TABLE farmer_affiliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID as primary key
    farmer_id UUID NOT NULL REFERENCES farmer(id) ON DELETE CASCADE, -- Foreign key to farmer table
    member_of_cooperative BOOLEAN NOT NULL, -- Whether the farmer is a member of a cooperative
    name VARCHAR(255), -- Name of the cooperative (if applicable)
    activities TEXT -- Activities the farmer is involved in (free text)
);


