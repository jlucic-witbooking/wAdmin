package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.Authority;
import com.witbooking.admin.repository.AuthorityRepository;

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
 * Test class for the AuthorityResource REST controller.
 *
 * @see AuthorityResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class AuthorityResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";

    @Inject
    private AuthorityRepository authorityRepository;

    private MockMvc restAuthorityMockMvc;

    private Authority authority;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AuthorityResource authorityResource = new AuthorityResource();
        ReflectionTestUtils.setField(authorityResource, "authorityRepository", authorityRepository);
        this.restAuthorityMockMvc = MockMvcBuilders.standaloneSetup(authorityResource).build();
    }

    @Before
    public void initTest() {
        authority = new Authority();
        authority.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createAuthority() throws Exception {
        int databaseSizeBeforeCreate = authorityRepository.findAll().size();

        // Create the Authority
        restAuthorityMockMvc.perform(post("/api/authoritys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(authority)))
                .andExpect(status().isCreated());

        // Validate the Authority in the database
        List<Authority> authoritys = authorityRepository.findAll();
        assertThat(authoritys).hasSize(databaseSizeBeforeCreate + 1);
        Authority testAuthority = authoritys.get(authoritys.size() - 1);
        assertThat(testAuthority.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(authorityRepository.findAll()).hasSize(0);
        // set the field null
        authority.setName(null);

        // Create the Authority, which fails.
        restAuthorityMockMvc.perform(post("/api/authoritys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(authority)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<Authority> authoritys = authorityRepository.findAll();
        assertThat(authoritys).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllAuthoritys() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        // Get all the authoritys
        restAuthorityMockMvc.perform(get("/api/authoritys"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        // Get the authority
        restAuthorityMockMvc.perform(get("/api/authoritys/{id}", authority.getName()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAuthority() throws Exception {
        // Get the authority
        restAuthorityMockMvc.perform(get("/api/authoritys/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

		int databaseSizeBeforeUpdate = authorityRepository.findAll().size();

        // Update the authority
        authority.setName(UPDATED_NAME);
        restAuthorityMockMvc.perform(put("/api/authoritys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(authority)))
                .andExpect(status().isOk());

        // Validate the Authority in the database
        List<Authority> authoritys = authorityRepository.findAll();
        assertThat(authoritys).hasSize(databaseSizeBeforeUpdate);
        Authority testAuthority = authoritys.get(authoritys.size() - 1);
        assertThat(testAuthority.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

		int databaseSizeBeforeDelete = authorityRepository.findAll().size();

        // Get the authority
        restAuthorityMockMvc.perform(delete("/api/authoritys/{id}", authority.getName())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Authority> authoritys = authorityRepository.findAll();
        assertThat(authoritys).hasSize(databaseSizeBeforeDelete - 1);
    }
}
