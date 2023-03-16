import { Button, Menu, Header } from 'semantic-ui-react'

const TopBar: React.FC = () => (
  <Menu style={{width: '90%', display: 'flex', justifyContent: 'flex-end'}} >
    <Menu.Item>
        <Header as='h5'>Samuel Banini (Admin)</Header>
    </Menu.Item>
    <Menu.Item>
      <Button color='red'>Logout</Button>
    </Menu.Item>
  </Menu>
)

export default TopBar