package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.AuthorizedEstablishmentUser;
import com.witbooking.admin.repository.AuthorizedEstablishmentUserRepository;

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
 * Test class for the AuthorizedEstablishmentUserResource REST controller.
 *
 * @see AuthorizedEstablishmentUserResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class AuthorizedEstablishmentUserResourceTest {


    @Inject
    private AuthorizedEstablishmentUserRepository authorizedEstablishmentUserRepository;

    private MockMvc restAuthorizedEstablishmentUserMockMvc;

    private AuthorizedEstablishmentUser authorizedEstablishmentUser;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AuthorizedEstablishmentUserResource authorizedEstablishmentUserResource = new AuthorizedEstablishmentUserResource();
        ReflectionTestUtils.setField(authorizedEstablishmentUserResource, "authorizedEstablishmentUserRepository", authorizedEstablishmentUserRepository);
        this.restAuthorizedEstablishmentUserMockMvc = MockMvcBuilders.standaloneSetup(authorizedEstablishmentUserResource).build();
    }

    @Before
    public void initTest() {
        authorizedEstablishmentUser = new AuthorizedEstablishmentUser();
    }

    @Test
    @Transactional
    public void createAuthorizedEstablishmentUser() throws Exception {
        int databaseSizeBeforeCreate = authorizedEstablishmentUserRepository.findAll().size();

        // Create the AuthorizedEstablishmentUser
        restAuthorizedEstablishmentUserMockMvc.perform(post("/api/authorizedEstablishmentUsers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(authorizedEstablishmentUser)))
                .andExpect(status().isCreated());

        // Validate the AuthorizedEstablishmentUser in the database
        List<AuthorizedEstablishmentUser> authorizedEstablishmentUsers = authorizedEstablishmentUserRepository.findAll();
        assertThat(authorizedEstablishmentUsers).hasSize(databaseSizeBeforeCreate + 1);
        AuthorizedEstablishmentUser testAuthorizedEstablishmentUser = authorizedEstablishmentUsers.get(authorizedEstablishmentUsers.size() - 1);
    }

    @Test
    @Transactional
    public void getAllAuthorizedEstablishmentUsers() throws Exception {
        // Initialize the database
        authorizedEstablishmentUserRepository.saveAndFlush(authorizedEstablishmentUser);

        // Get all the authorizedEstablishmentUsers
        restAuthorizedEstablishmentUserMockMvc.perform(get("/api/authorizedEstablishmentUsers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(authorizedEstablishmentUser.getId().intValue())));
    }

    @Test
    @Transactional
    public void getAuthorizedEstablishmentUser() throws Exception {
        // Initialize the database
        authorizedEstablishmentUserRepository.saveAndFlush(authorizedEstablishmentUser);

        // Get the authorizedEstablishmentUser
        restAuthorizedEstablishmentUserMockMvc.perform(get("/api/authorizedEstablishmentUsers/{id}", authorizedEstablishmentUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(authorizedEstablishmentUser.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAuthorizedEstablishmentUser() throws Exception {
        // Get the authorizedEstablishmentUser
        restAuthorizedEstablishmentUserMockMvc.perform(get("/api/authorizedEstablishmentUsers/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAuthorizedEstablishmentUser() throws Exception {
        // Initialize the database
        authorizedEstablishmentUserRepository.saveAndFlush(authorizedEstablishmentUser);
		
		int databaseSizeBeforeUpdate = authorizedEstablishmentUserRepository.findAll().size();

        // Update the authorizedEstablishmentUser
        restAuthorizedEstablishmentUserMockMvc.perform(put("/api/authorizedEstablishmentUsers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(authorizedEstablishmentUser)))
                .andExpect(status().isOk());

        // Validate the AuthorizedEstablishmentUser in the database
        List<AuthorizedEstablishmentUser> authorizedEstablishmentUsers = authorizedEstablishmentUserRepository.findAll();
        assertThat(authorizedEstablishmentUsers).hasSize(databaseSizeBeforeUpdate);
        AuthorizedEstablishmentUser testAuthorizedEstablishmentUser = authorizedEstablishmentUsers.get(authorizedEstablishmentUsers.size() - 1);
    }

    @Test
    @Transactional
    public void deleteAuthorizedEstablishmentUser() throws Exception {
        // Initialize the database
        authorizedEstablishmentUserRepository.saveAndFlush(authorizedEstablishmentUser);
		
		int databaseSizeBeforeDelete = authorizedEstablishmentUserRepository.findAll().size();

        // Get the authorizedEstablishmentUser
        restAuthorizedEstablishmentUserMockMvc.perform(delete("/api/authorizedEstablishmentUsers/{id}", authorizedEstablishmentUser.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<AuthorizedEstablishmentUser> authorizedEstablishmentUsers = authorizedEstablishmentUserRepository.findAll();
        assertThat(authorizedEstablishmentUsers).hasSize(databaseSizeBeforeDelete - 1);
    }
}
