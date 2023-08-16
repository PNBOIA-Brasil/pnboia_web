require "open-uri"

# User.destroy_all


# u = User.new(
#   email: "vanessabach.r@gmail.com",
#   username: "pesquisadores",
#   password: "operantar",
#   admin: false
# )


Buoy.destroy_all

tables = CSV.parse(File.read("db/buoys.csv"), headers: true, :col_sep => ",")

tables.each do |row|
  u = Buoy.new(
    buoy_id: row['buoy_id'].to_i,
    hull_id: row['hull_id'].to_i, 
    name: row['name'], 
    deploy_date: row['deploy_date'], 
    latitude: row['latitude'], 
    longitude: row['longitude'], 
    status: row['status'], 
    mode: row['mode'], 
    wmo_number: row['wmo_number'], 
    antenna_id: row['antenna_id'], 
    open_data: row['open_data'], 
    link_site_pnboia: row['link_site_pnboia'], 
    project_id: row['project_id']
  )
  u.save!
  puts("Buoy #{row['buoy_id'].to_i} in the database")
end

