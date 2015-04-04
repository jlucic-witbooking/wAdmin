package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.UserGroup;
import com.witbooking.admin.repository.UserGroupRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserGroupResource REST controller.
 *
 * @see UserGroupResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class UserGroupResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";

    @Inject
    private UserGroupRepository userGroupRepository;

    private MockMvc restUserGroupMockMvc;

    private UserGroup userGroup;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        UserGroupResource userGroupResource = new UserGroupResource();
        ReflectionTestUtils.setField(userGroupResource, "userGroupRepository", userGroupRepository);
        this.restUserGroupMockMvc = MockMvcBuilders.standaloneSetup(userGroupResource).build();
    }

    @Before
    public void initTest() {
        userGroup = new UserGroup();
        userGroup.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createUserGroup() throws Exception {
        int databaseSizeBeforeCreate = userGroupRepository.findAll().size();

        // Create the UserGroup
        restUserGroupMockMvc.perform(post("/api/userGroups")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userGroup)))
                .andExpect(status().isCreated());

        // Validate the UserGroup in the database
        List<UserGroup> userGroups = userGroupRepository.findAll();
        assertThat(userGroups).hasSize(databaseSizeBeforeCreate + 1);
        UserGroup testUserGroup = userGroups.get(userGroups.size() - 1);
        assertThat(testUserGroup.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(userGroupRepository.findAll()).hasSize(0);
        // set the field null
        userGroup.setName(null);

        // Create the UserGroup, which fails.
        restUserGroupMockMvc.perform(post("/api/userGroups")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userGroup)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<UserGroup> userGroups = userGroupRepository.findAll();
        assertThat(userGroups).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllUserGroups() throws Exception {
        // Initialize the database
        userGroupRepository.saveAndFlush(userGroup);

        // Get all the userGroups
        restUserGroupMockMvc.perform(get("/api/userGroups"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(userGroup.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getUserGroup() throws Exception {
        // Initialize the database
        userGroupRepository.saveAndFlush(userGroup);

        // Get the userGroup
        restUserGroupMockMvc.perform(get("/api/userGroups/{id}", userGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(userGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUserGroup() throws Exception {
        // Get the userGroup
        restUserGroupMockMvc.perform(get("/api/userGroups/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserGroup() throws Exception {
        // Initialize the database
        userGroupRepository.saveAndFlush(userGroup);
		
		int databaseSizeBeforeUpdate = userGroupRepository.findAll().size();

        // Update the userGroup
        userGroup.setName(UPDATED_NAME);
        restUserGroupMockMvc.perform(put("/api/userGroups")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userGroup)))
                .andExpect(status().isOk());

        // Validate the UserGroup in the database
        List<UserGroup> userGroups = userGroupRepository.findAll();
        assertThat(userGroups).hasSize(databaseSizeBeforeUpdate);
        UserGroup testUserGroup = userGroups.get(userGroups.size() - 1);
        assertThat(testUserGroup.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteUserGroup() throws Exception {
        // Initialize the database
        userGroupRepository.saveAndFlush(userGroup);
		
		int databaseSizeBeforeDelete = userGroupRepository.findAll().size();

        // Get the userGroup
        restUserGroupMockMvc.perform(delete("/api/userGroups/{id}", userGroup.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<UserGroup> userGroups = userGroupRepository.findAll();
        assertThat(userGroups).hasSize(databaseSizeBeforeDelete - 1);
    }
}
