import React from 'react'
import { Grid } from 'semantic-ui-react'
import ProfileHeader from './ProfileHeader'

export default function ProfilePage() {
    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader/>
                <h2>Profile content</h2>
            </Grid.Column>
        </Grid>
    )
}
