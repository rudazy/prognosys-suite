-- Ensure user's profile exists and set admin
-- Create profile if missing based on auth.users email
-- Note: We can't query auth.users from client, but in SQL we can
insert into profiles (user_id, email, display_name, is_admin)
select u.id, u.email, split_part(u.email, '@', 1), true
from auth.users u
left join profiles p on p.user_id = u.id
where lower(u.email) = lower('Ludaluda134@gmail.com')
  and p.user_id is null;

-- Set admin flag to true for the profile
update profiles
set is_admin = true
where lower(email) = lower('Ludaluda134@gmail.com');