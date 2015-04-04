package com.witbooking.admin.web.rest;

import com.witbooking.admin.Application;
import com.witbooking.admin.domain.Right;
import com.witbooking.admin.repository.RightRepository;

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
 * Test class for the RightResource REST controller.
 *
 * @see RightResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class RightResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";
    private static final String DEFAULT_DESCRIPTION = "SAMPLE_TEXT";
    private static final String UPDATED_DESCRIPTION = "UPDATED_TEXT";

    @Inject
    private RightRepository rightRepository;

    private MockMvc restRightMockMvc;

    private Right right;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        RightResource rightResource = new RightResource();
        ReflectionTestUtils.setField(rightResource, "rightRepository", rightRepository);
        this.restRightMockMvc = MockMvcBuilders.standaloneSetup(rightResource).build();
    }

    @Before
    public void initTest() {
        right = new Right();
        right.setName(DEFAULT_NAME);
        right.setDescription(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createRight() throws Exception {
        int databaseSizeBeforeCreate = rightRepository.findAll().size();

        // Create the Right
        restRightMockMvc.perform(post("/api/rights")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(right)))
                .andExpect(status().isCreated());

        // Validate the Right in the database
        List<Right> rights = rightRepository.findAll();
        assertThat(rights).hasSize(databaseSizeBeforeCreate + 1);
        Right testRight = rights.get(rights.size() - 1);
        assertThat(testRight.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRight.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(rightRepository.findAll()).hasSize(0);
        // set the field null
        right.setName(null);

        // Create the Right, which fails.
        restRightMockMvc.perform(post("/api/rights")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(right)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<Right> rights = rightRepository.findAll();
        assertThat(rights).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllRights() throws Exception {
        // Initialize the database
        rightRepository.saveAndFlush(right);

        // Get all the rights
        restRightMockMvc.perform(get("/api/rights"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(right.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getRight() throws Exception {
        // Initialize the database
        rightRepository.saveAndFlush(right);

        // Get the right
        restRightMockMvc.perform(get("/api/rights/{id}", right.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(right.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRight() throws Exception {
        // Get the right
        restRightMockMvc.perform(get("/api/rights/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRight() throws Exception {
        // Initialize the database
        rightRepository.saveAndFlush(right);
		
		int databaseSizeBeforeUpdate = rightRepository.findAll().size();

        // Update the right
        right.setName(UPDATED_NAME);
        right.setDescription(UPDATED_DESCRIPTION);
        restRightMockMvc.perform(put("/api/rights")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(right)))
                .andExpect(status().isOk());

        // Validate the Right in the database
        List<Right> rights = rightRepository.findAll();
        assertThat(rights).hasSize(databaseSizeBeforeUpdate);
        Right testRight = rights.get(rights.size() - 1);
        assertThat(testRight.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRight.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void deleteRight() throws Exception {
        // Initialize the database
        rightRepository.saveAndFlush(right);
		
		int databaseSizeBeforeDelete = rightRepository.findAll().size();

        // Get the right
        restRightMockMvc.perform(delete("/api/rights/{id}", right.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Right> rights = rightRepository.findAll();
        assertThat(rights).hasSize(databaseSizeBeforeDelete - 1);
    }
}
